export const getResources = (room: Room, type: ResourceConstant) => {
    return room.find(FIND_DROPPED_RESOURCES, {
        filter: (res) => res.resourceType === type
    })
}

export const getFreeResource = (room: Room, type: ResourceConstant) => {
}
