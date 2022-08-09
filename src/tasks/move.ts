import { Task } from "../core/TaskManager"
import { CanMove, HasBodyPart } from "./conditions"

export class MoveTask extends Task {
    name = 'MoveTask'

    constructor(public target: RoomPosition) {
        super()
    }

    conditions = (creep: Creep) => [
        new HasBodyPart(MOVE),
        new CanMove()
    ]

    action = (creep: Creep) => creep.moveTo(this.target, {
        visualizePathStyle: { stroke: '#ffffff' }
    })

    cost = (creep: Creep) => creep.pos.getRangeTo(this.target)

}
