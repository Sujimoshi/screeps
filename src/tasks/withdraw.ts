import { Task } from "../core/TaskManager";
import { HasBodyPart, HasUsedResourceCapacity, IsInRangeTo } from "./conditions";

export class WithdrawTask extends Task {
    name = 'WithdrawTask'

    constructor(public target: AnyStructure, public resourceType: ResourceConstant) {
        super()
    }

    cost = (creep: Creep) => creep.pos.getRangeTo(this.target.pos)

    conditions = (creep: Creep) => [
        new HasBodyPart(CARRY),
        new HasUsedResourceCapacity(this.resourceType, '<', 1),
        new IsInRangeTo(this.target.pos, 1)
    ]

    action = (creep: Creep) => creep.withdraw(this.target, this.resourceType)

}
