import { Task } from "../core/TaskManager";
import { HasUsedResourceCapacity, HasBodyPart, IsInRangeTo } from "./conditions";

export class TransferTask extends Task {
    name = 'TransferTask'

    constructor(
        public target: Structure,
        public resourceType: ResourceConstant,
        public amount?: number
    ) {
        super()
    }

    conditions = () => [
        new HasBodyPart(WORK),
        new HasUsedResourceCapacity(this.resourceType, '>', 0),
        new IsInRangeTo(this.target.pos, 1),
    ]

    action = (creep: Creep) => creep.transfer(this.target, this.resourceType, this.amount)

    cost = (creep: Creep) => creep.pos.getRangeTo(this.target)
}
