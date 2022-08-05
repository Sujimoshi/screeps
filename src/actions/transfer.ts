import { Action, Prerequisite } from ".";
import { handle } from "../utils/error";
import { CreepResourceCapacity, CreepHaveBodyPart, CreepIsInRangeTo } from "./prerequisites";

export class TransferAction extends Action {
    constructor(
        public target: Structure,
        public resourceType: ResourceConstant,
        public amount?: number
    ) {
        super('TransferAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(WORK),
        new CreepResourceCapacity(this.resourceType, '>', 0),
        new CreepIsInRangeTo(this.target.pos, 1),
    ]

    action = (creep: Creep) => {
        return handle(creep.transfer(this.target, this.resourceType, this.amount), 'Creep.transfer')
    }

    cost = (creep: Creep) => 1
}
