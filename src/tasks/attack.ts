import { Task } from "../core/TaskManager";
import { HasBodyPart, IsInRangeTo } from "./conditions";

export class AttackTask extends Task {
    name = 'AttackTask'

    constructor(public target: AnyCreep | Structure) {
        super()
    }

    cost = (creep: Creep) => creep.pos.getRangeTo(this.target)

    conditions = (creep: Creep) => [
        new HasBodyPart(ATTACK),
        new IsInRangeTo(this.target.pos, 1)
    ]

    action = (creep: Creep) => creep.attack(this.target)
}
