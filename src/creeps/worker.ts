export enum BuilderState {
    Building = 'building',
    Seeking = 'seeking'
}

/**
 * [WORK, CARRY, MOVE]
 */
export const worker = {
    run: function(creep: Creep) {

        if(creep.memory.state === BuilderState.Building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.state = BuilderState.Seeking;
        }
        if(creep.memory.state !== BuilderState.Building && creep.store.getFreeCapacity() == 0) {
            creep.memory.state = BuilderState.Building;
        }

        if(creep.memory.state === BuilderState.Building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        creep.say(`${creep.name} - ${creep.memory.role} - ${creep.memory.state}`);
    }
};
