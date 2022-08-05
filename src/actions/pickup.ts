import { Action } from ".";
import { handle } from "../utils/error";
import { CreepResourceCapacity, CreepHaveBodyPart, CreepIsInRangeTo } from "./prerequisites";

export class PickupAction extends Action {
    constructor(public resource: Resource) {
        super('PickupAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(CARRY),
        new CreepResourceCapacity(this.resource.resourceType, '<=', 0),
        new CreepIsInRangeTo(this.resource.pos, 1)
    ]

    action = (creep: Creep) => {
        return handle(creep.pickup(this.resource), 'Creep.pickup')
    }

    cost = (creep: Creep) => 1
}
