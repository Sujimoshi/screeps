import { LoopContext } from "../core/Container";
import { EconomyAnalyzerRepository } from "../core/EconomyAlanyzer";
import { TaskRequestQueue } from "../core/TaskManager/queue";
import { Provider } from "../main";
import { getMyRooms } from "../selectors/room";
import { MemoizeByTick } from "../utils/memoize";
import { builder } from "./builder";
import { creepTasksCreator } from "./creepTasksCreator";
import { spawnLoop } from "./spawn";
import { towerTasks } from "./tower";

export class RoomContext {
  constructor(
    public room: Room,
    public taskQueue: TaskRequestQueue,
    public economyAnalyzerRepository: EconomyAnalyzerRepository
  ) {}

  get economyAnalyzer () {
    return this.economyAnalyzerRepository.get(this)
  }

  get roads () {
    return this.room.memory.roads || []
  }

  addRoad (pair: [string, string]) {
    this.room.memory.roads = [...this.roads, pair]
  }

  @MemoizeByTick()
  get creeps () {
    return Object.values(Game.creeps).filter(creep => creep.memory.room === this.room.name)
  }

  @MemoizeByTick()
  get sources () {
    return this.room.find(FIND_SOURCES)
  }

  @MemoizeByTick()
  get droppedEnergyResources () {
    return this.room.find(FIND_DROPPED_RESOURCES, {
      filter: { resourceType: RESOURCE_ENERGY }
    })
  }

  @MemoizeByTick()
  get spawns () {
    return Object.values(Game.spawns).filter(spawn => spawn.room.name === this.room.name)
  }

  @MemoizeByTick()
  get extensions (): StructureExtension[] {
    return this.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    })
  }

  @MemoizeByTick()
  get enemies () {
    return this.room.find(FIND_HOSTILE_CREEPS)
  }

  @MemoizeByTick()
  get constructionSites () {
    return this.room.find(FIND_MY_CONSTRUCTION_SITES)
  }

  @MemoizeByTick()
  get towers (): StructureTower[] {
    return this.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    })
  }

  @MemoizeByTick()
  get structures (): Structure[] {
    return this.room.find(FIND_MY_STRUCTURES)
  }

  @MemoizeByTick()
  get paths (): StructureRoad[] {
    return this.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_ROAD }
    })
  }

  @MemoizeByTick()
  get containers (): StructureContainer[] {
    return this.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_CONTAINER }
    })
  }

  get miners (): Creep[] {
    return this.creeps.filter(creep => creep.name.includes('miner'))
  }

  findPositionAtRange(
    pos: RoomPosition,
    cb: (x: number, y: number) => boolean,
    range: number = 1,
    step: number = 2,
  ) {
    for(let x = pos.x - range; x <= pos.x + range; x += step) {
      for(let y = pos.y - range; y <= pos.y + range; y += step) {
        if (pos.x !== x || pos.y !== y) {
          if (cb(x, y)) return true
        }
      }
    }
    return false
  }
}

export const roomLoop = (context: LoopContext): Provider => ({ taskManager }, app) => {

  for (const room of getMyRooms()) {
    console.log(room.name)

    const roomContext = context[room.name] = new RoomContext(
      room,
      app.get('taskQueue'),
      app.get('economyAnalyzerRepository')
    )

    taskManager.process()

    app.use(creepTasksCreator(roomContext))

    app.use(towerTasks(roomContext))

    app.use(spawnLoop(roomContext))

    app.use(builder(roomContext))

    console.log('Harvested in this tick:', roomContext.economyAnalyzer.harvested())
    console.log('Disappeared in this tick', roomContext.economyAnalyzer.disappeared())
    console.log('Took in this tick',
      roomContext.economyAnalyzer.availableEnergyAmount()
      - roomContext.economyAnalyzer.prevAvailableEnergyAmount
      - (roomContext.economyAnalyzer.harvested() - roomContext.economyAnalyzer.disappeared())
    )

    console.log('Disappeared in last 1000 ticks', roomContext.economyAnalyzer.looses(1000))
    console.log('Harvested in last 1000 ticks', roomContext.economyAnalyzer.supply(1000))
    console.log('Took in last 1000 ticks', roomContext.economyAnalyzer.demand(1000), '(', roomContext.economyAnalyzer.demand(1000) + roomContext.economyAnalyzer.looses(1000), ')')
    console.log('Available energy', roomContext.economyAnalyzer.availableEnergyAmount())
    console.log('Available dropped energy', roomContext.economyAnalyzer.droppedEnergyAmount())

    roomContext.economyAnalyzer.analyze()
  }

}
