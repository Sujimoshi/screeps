import { ErrorMapper } from "./utils/ErrorMapper";
import { isNewVersion, updateVersion } from "./utils/version";
import { ActionsManager } from "./actions";
import { sourceManager } from "./managers/source";
import { spawnManager } from "./managers/spawn";
import { controllerManager } from "./managers/controller";
import { resourceManager } from "./managers/resource";
import { table } from "table";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    version: string;
    uuid: number;
    i: any[];
  }

  interface CreepMemory {
    room: string
  }

  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

const roomProcessor = (room: Room) => {
  console.log(room.name)
  const actionsManager = new ActionsManager(room)

  spawnManager(actionsManager)(room)
  controllerManager(actionsManager)(room)
  resourceManager(actionsManager)(room)
  sourceManager(actionsManager)(room)

  actionsManager.process()
  actionsManager.log()
}

export const loop = ErrorMapper.wrapLoop(() => {
  console.table = (data: any) => console.log(table(data))
  console.log('\n'.repeat(15))


  // for (const name in Game.creeps) {
  //   creepProcessor(Game.creeps[name])
  // }

  for (const name in Game.spawns) {
    roomProcessor(Game.spawns[name].room)
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // const creepPool = new CreepPool()
  // creepPool.preTick()


  // creepPool.intentAcquireCreep([
  //   CARRY, MOVE, WORK
  // ], 10)


  // creepPool.intentAcquireCreep([
  //   CARRY, MOVE, WORK
  // ], 10)

  // // creepPool.intentAcquireCreep([
  // //   CARRY, MOVE, WORK
  // // ])

  // // creepPool.intentAcquireCreep([
  // //   CARRY, MOVE, WORK
  // // ])

  // const evaluations = creepPool.evaluate()
  // // console.log(JSON.stringify(evaluations, null, 2))
  // evaluations.forEach((e) => {
  //   console.log(JSON.stringify(e))
  //   console.log(creepPool.fulfillIntent(e))
  // })

  if (isNewVersion()) console.log('New changes pushed')
  updateVersion()
  // creepPool.postTick()

});
