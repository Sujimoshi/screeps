import { RoomContext } from "."
import { Provider } from "../main"

interface Struct {
    id: string
    pos: RoomPosition
}

export const builder = (context: RoomContext): Provider => () => {
    context.room.find(FIND_FLAGS).forEach(flag => flag.remove())

    // paths
    const structures = [...context.structures, ...context.sources]
    const pairs: [Struct, Struct][] = structures.reduce((acc, structure) => {
        for (const struct of structures) {
            if (struct === structure) break;
            const exists = context.roads.some(([l, r]) => {
                return (l === structure.id && r === struct.id)
                    || (l === struct.id && r === structure.id)
            })
            if (!exists) acc.push([structure, struct])
        }
        return acc
    }, <[Struct, Struct][]>[])

    pairs.forEach(([l, r]) => {
        PathFinder.search(l.pos, r.pos).path.forEach(pos => {
            context.room.createConstructionSite(pos, STRUCTURE_ROAD)
        })
        context.addRoad([l.id, r.id])
    })

    // source containers
    context.sources.forEach(source => {
        const containersAround = [
            ...source.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } }),
            ...source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, { filter: { structureType: STRUCTURE_CONTAINER } }),
        ]
        if (!containersAround.length) {
            context.findPositionAtRange(source.pos, (x, y) => {
                return [OK, ERR_RCL_NOT_ENOUGH].includes(
                    context.room.createConstructionSite(x, y, STRUCTURE_CONTAINER) as any
                )
            }, 1, 1)
        }
    })

    // spawn extensions
    context.spawns.forEach(spawn => {
        let res = 0
        let range = 0
        while (res !== ERR_RCL_NOT_ENOUGH) {
            context.findPositionAtRange(spawn.pos, (x, y) => {
                res = context.room.createConstructionSite(x, y, STRUCTURE_EXTENSION)
                if (res === ERR_RCL_NOT_ENOUGH) return true
                return false
            }, range += 2, 2)
        }
    })

    // rampart

}
