import { Task } from "../core/TaskManager";
import { HasBodyPart, HasUsedResourceCapacity, IsInRangeTo } from "./conditions";

export class HarvestTask extends Task {
    name = 'HarvestTask'

    constructor(public source: Source) {
        super()
    }

    conditions = (creep: Creep) => {
        const [container] = this.source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })
        return [
            new HasBodyPart(WORK),
            ...((container && creep.name.includes('miner')) ? [new IsInRangeTo(container.pos, 0)] : [new IsInRangeTo(this.source.pos, 1)])
        ]
    }

    action = (creep: Creep) => {
        if (creep.store.getUsedCapacity() === creep.store.getCapacity()) return -99
        return creep.harvest(this.source)
    }

    cost = (creep: Creep) => creep.pos.getRangeTo(this.source) * (creep.getActiveBodyparts(CARRY) + 1)
}
