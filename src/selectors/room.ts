export const getSources = (room: Room) => {
    return room.find(FIND_SOURCES)
}

export const getCreeps = (room: Room) => {
    return Object.values(Game.creeps).filter(creep => creep.memory.room === room.name)
}

export const getSpawns = (room: Room) => {
    return Object.values(Game.spawns).filter(spawn => spawn.room.name === room.name)
}

export const getResources = (room: Room, type: ResourceConstant) => {
    return room.find(FIND_DROPPED_RESOURCES, {
        filter: (res) => res.resourceType === type
    })
}
