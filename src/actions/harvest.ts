import { Action } from ".";
import { handle } from "../utils/error";
import { CreepHaveBodyPart, CreepIsInRangeTo } from "./prerequisites";

export class HarvestAction extends Action {

    constructor(public source: Source) {
        super('HarvestAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(WORK),
        new CreepIsInRangeTo(this.source.pos, 1)
    ]

    action = (creep: Creep) => {
        return handle(creep.harvest(this.source), 'Creep.harvest')
    }

    cost = (creep: Creep) => creep.getActiveBodyparts(CARRY) * 100

}
