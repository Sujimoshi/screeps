import { ActionsManager } from "../actions";
import { TransferAction } from "../actions/transfer";
import { getCreeps, getSources, getSpawns } from "../selectors/room";

export const spawnManager = (manager: ActionsManager) => (room: Room) => {
    const spawns = getSpawns(room)

    spawns.forEach(spawn => {
        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            manager.push(new TransferAction(spawn, RESOURCE_ENERGY))
        }
    })


    const config = [
        {
            type: 'worker',
            count: 5,
            body: [WORK, MOVE, CARRY]
        },
        {
            type: 'miner',
            count: getSources(room).length,
            body: [WORK, WORK, MOVE]
        }
    ]

    const creeps = getCreeps(room)
    for (const { type, count, body } of config) {
        const creepsOfType = creeps.filter(creep => creep.name.includes(type))
        if (creepsOfType.length < count) spawns[0].spawnCreep(body, `${type}${Game.time.toString()}`, {
            memory: {
                room: room.name
            }
        })
    }

}
