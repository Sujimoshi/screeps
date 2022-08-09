export const getMyRooms = () => {
    return Object.values(Game.spawns).map(spawn => spawn.room)
}

export const getSources = (room: Room) => {
    return room.find(FIND_SOURCES)
}

export const getCreeps = (room: Room) => {
    // @ts-ignore
    return Object.values(Game.creeps).filter(creep => creep.memory.room === room.name)
}

export const getSpawns = (room: Room) => {
    return Object.values(Game.spawns).filter(spawn => spawn.room.name === room.name)
}

export const getResources = <T extends ResourceConstant>(room: Room, type: T): Resource<T>[] => {
    return room.find(FIND_DROPPED_RESOURCES, {
        filter: (res) => res.resourceType === type
    })
}

export const getEnemies = (room: Room) => {
    return room.find(FIND_HOSTILE_CREEPS)
}

export const getConstructionSites = (room: Room) => {
    return room.find(FIND_MY_CONSTRUCTION_SITES)
}

export const getStructures = (room: Room, structureType: StructureConstant) => {
    return room.find(FIND_MY_STRUCTURES, {
        filter: { structureType }
    })
}
