import { handle } from "../utils/error"
import { Action } from "./"
import { CreepHaveBodyPart } from "./prerequisites"

export class MoveAction extends Action {

    constructor(public target: RoomPosition) {
        super('MoveAction')
    }

    prereqs = (creep: Creep) => [
        new CreepHaveBodyPart(MOVE)
    ]

    action = (creep: Creep): boolean => {
        if (creep.fatigue > 0) return true
        return handle(creep.moveTo(this.target, {
            visualizePathStyle: { stroke: '#ffffff' }
        }), 'Creep.moveTo')
    }

    cost = (creep: Creep) => creep.pos.findPathTo(this.target).length

}
