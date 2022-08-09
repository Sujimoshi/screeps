import { Task } from "../core/TaskManager";

export class WaitTask extends Task {
    name = 'WaitTask'

    conditions = (creep: Creep) => []

    action = (creep: Creep): number => 0

    cost = (creep: Creep) => 0
}
