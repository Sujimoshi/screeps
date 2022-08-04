import { memoize } from "lodash"

export const getSources = memoize((room: Room) => {
    return room.find(FIND_SOURCES)
})

export const getCreeps = memoize((room: Room) => {
    return Object.values(Game.creeps).filter(creep => creep.room.name === room.name)
})
