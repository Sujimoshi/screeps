export class Miner {
    static role = 'miner'
    static state = 'mining'

    constructor(public creep: Creep) {}

    static run (creep: Creep) {
        const source = Game.getObjectById(creep.memory.target) as Source
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        creep.say(`${creep.name}-${creep.memory.state}`)
    }
}

export class MinerController {
    static findMiners(room: Room) {
        const res = []
        for (const name in Game.creeps) {
            const creep = Game.creeps[name]
            if (creep.room.name === room.name && creep.memory.role === 'miner') {
                res.push(creep)
            }
        }
        return res
    }

    static findSourcesWithoutMiners(room: Room) {
        const miners = this.findMiners(room)
        return room.find(FIND_SOURCES).filter(source => {
            return !miners.some(miner => miner.memory.target === source.id)
        })
    }

    static process (room: Room) {
        const sourcesWithoutMiner = this.findSourcesWithoutMiners(room)
        sourcesWithoutMiner.forEach(source => {
            Game.spawns['K'].spawnCreep([WORK, WORK, MOVE], `Miner${Game.time.toString()}`, {
                memory: {
                    state: Miner.state,
                    role: Miner.role,
                    target: source.id
                }
            })
        })
    }
}
