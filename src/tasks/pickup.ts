import { Task } from "../core/TaskManager";
import { HasUsedResourceCapacity, HasBodyPart, IsInRangeTo } from "./conditions";

export class PickupTask extends Task {
    name = 'PickupTask'

    constructor(public resource: Resource) {
        super()
    }

    conditions = (creep: Creep) => [
        new HasBodyPart(CARRY),
        new HasUsedResourceCapacity(this.resource.resourceType, '<', 1),
        new IsInRangeTo(this.resource.pos, 1)
    ]

    action = (creep: Creep) => creep.pickup(this.resource)

    cost = (creep: Creep) => creep.pos.getRangeTo(this.resource)
}
