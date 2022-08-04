import { Prerequisite } from "."
import { MoveAction } from "./move"

export class CreepHaveBodyPart extends Prerequisite {
    constructor(public part: BodyPartConstant) {
        super()
    }

    meets = (creep: Creep) => creep.getActiveBodyparts(this.part) > 0

    toMeet = () => null
}

export class CreepIsInRangeTo extends Prerequisite {
    constructor(public pos: RoomPosition, public range: number) {
        super()
    }

    meets = (creep: Creep) => creep.pos.inRangeTo(this.pos, this.range)

    toMeet = () => new MoveAction(this.pos)
}
