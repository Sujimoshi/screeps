import { RoomContext } from ".";
import { Provider } from "../main";

export const spawnLoop = (context: RoomContext): Provider => () => {
    const config = [
        {
            type: 'worker',
            count: 7,
            body: [WORK, MOVE, CARRY]
        },
        {
            type: 'miner',
            count: context.sources.length,
            body: [WORK, WORK, MOVE]
        },
        {
            type: 'attacker',
            count: context.enemies.length * 2,
            body: [ATTACK, ATTACK, MOVE]
        }
    ]

    if (context.creeps.length >= config.reduce((tmp, { count }) => tmp += count, 0)) return

    for (const { type, count, body } of config) {
        const creepsOfType = context.creeps.filter(creep => creep.name.includes(type))
        if (creepsOfType.length < count) context.spawns[0].spawnCreep(body, `${type}${Game.time.toString()}`, {
            memory: {
                room: context.room.name
            }
        })
    }

}
