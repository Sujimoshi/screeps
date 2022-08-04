import { Tickable } from './interfaces/index'

type Capabilities = Array<BodyPartConstant>

type intentAcquireCreep = {
  capabilities: Capabilities
  priority: number
  evaluation: 'no' | 'exist' | 'can_spawn' | 'cant_spawn' | 'spawning'
  id: number
}

export class CreepPool implements Tickable {
  private spawn: StructureSpawn
  private creeps: Record<string, Creep & { intentAcquireState?: 'no' | 'locked', intentId?: number }>
  private intents: Array<intentAcquireCreep>
  private baseId: number

  constructor() {
    this.spawn = Game.spawns['Spawn1']
    this.creeps = Object.assign({}, Game.creeps)
    this.intents = []
    this.baseId = Game.time + 1
  }

  intentAcquireCreep(capabilities: Capabilities, priority: number = 0) {
    const id = this.baseId++
    const intent: intentAcquireCreep = { id, capabilities, priority, evaluation: 'no' }
    this.intents.push(intent)
    return intent
  }

  evaluate() {
    return this.intents
      .sort((l, r) => l.priority - r.priority)
      .map((intent) => {
        const creep = Object.values(this.creeps)
          .filter(creep => creep.intentAcquireState !== 'locked')
          .filter(creep => !creep.spawning)
          .find((creep) => {
            return _.isEqual(intent.capabilities.sort(), _.map(creep.body, 'type').sort())
          })

        if (creep) {
          creep.intentAcquireState = 'locked'
          creep.intentId = intent.id
          intent.evaluation = 'exist'
          return intent
        }


        const spawningCreep = Object.values(this.creeps)
          .filter(creep => creep.spawning)
          .filter(creep => creep.intentAcquireState !== 'locked')
          .find((creep) => {
            return _.isEqual(intent.capabilities.sort(), _.map(creep.body, 'type').sort())
          });

        if (spawningCreep) {
          spawningCreep.intentAcquireState = 'locked'
          spawningCreep.intentId = intent.id
          intent.evaluation = 'spawning'
          return intent
        }
        // TODO: Calculate resources using ResourceManager cause
        // dry run do not cosume them therefore there is True-Negative case
        const status = this.spawn.spawnCreep(intent.capabilities, this.getName(intent), {
          dryRun: true
        })
        intent.evaluation = status === OK ? 'can_spawn' : 'cant_spawn'
        return intent
      })
  }

  fulfillIntent(intent: intentAcquireCreep) {
    if (intent.evaluation === 'exist') {
      const creep = Object.values(this.creeps).find((creep) => creep.intentId = intent.id);
      // intent.cree
      return creep
    }

    if (intent.evaluation === 'can_spawn') {
      return this.spawn.spawnCreep(intent.capabilities, this.getName(intent), {})
    }
    return
  }

  preTick () {
    this.cleanup()
  }

  postTick () {
    this.cleanup()
  }

  private cleanup () {
    for(let name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          console.log('Clearing non-existing creep memory:', name);
      }
    }
  }

  private getName (intent: intentAcquireCreep) {
    // TODO: Single place for reandom stuff
    const id = Math.floor(Math.random() * 65534) + 1
    const capabilities = intent.capabilities.map(_ => _[0].toUpperCase()).join('')
    return `${capabilities}_${Game.time}_${id}`
  }
}
