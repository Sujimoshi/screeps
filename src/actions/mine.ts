import { Action } from ".";
import { handle } from "../utils/error";
import { CreepHaveBodyPart, CreepIsInRangeTo } from "./prerequisites";

export class MineAction extends Action {

    constructor(public source: Source) {
        super('MineAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(WORK),
        new CreepIsInRangeTo(this.source.pos, 1)
    ]

    action = (creep: Creep) => {
        return handle(creep.harvest(this.source), 'Creep.harvest')
    }

    cost = () => 1

}
