import { Action } from ".";
import { handle } from "../utils/error";
import { CreepResourceCapacity, CreepHaveBodyPart, CreepIsInRangeTo } from "./prerequisites";

export class UpgradeAction extends Action {
    constructor(
        public controller: StructureController
    ) {
        super('UpgradeAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(WORK),
        new CreepResourceCapacity(RESOURCE_ENERGY, '>', 0),
        new CreepIsInRangeTo(this.controller.pos, 3),
    ]

    action = (creep: Creep) => {
        return handle(creep.upgradeController(this.controller), 'Creep.upgradeController')
    }

    cost = (creep: Creep) => 1
}
