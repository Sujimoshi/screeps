import { table } from "table";
import { GameRef } from "../../utils/decorators";
import { Task } from "./task";

export interface TaskRequestConfig {
    creator: { id: string },
    task: Task,
    priority: number,
    capasity: number
}

export class TaskRequest {
    @GameRef()
    creep: Creep | null = null
    @GameRef()
    creator: { id: string; };
    task: Task;
    priority: number;
    capasity: number

    constructor(config: TaskRequestConfig) {
        this.creator = config.creator
        this.task = config.task
        this.priority = config.priority
        this.capasity = config.capasity
    }

    assign = (creep: Creep) => {
        this.creep = creep
        return this
    }

    toString = () => `[TaskRequest ${this.task.name} ${this.priority}]`

    process (): boolean {
        try {
            if (!this.creep || !this.creator) return false
            return this.task.run(this.creep)
        } catch (error) {
            return false
        }
    }
}

export class TaskRequestQueue {
    queue: TaskRequest[] = []

    add (request: TaskRequestConfig) {
        this.queue.push(new TaskRequest(request))
    }

    all () {
        return this.queue = this.queue.sort((a, b) => b.priority - a.priority)
    }

    log () {
        console.log(table([
            ['Creator', 'Task', 'Piority', 'Capasity'],
            ...this.all().map(el => [el.creator, el.task.name, el.priority, el.capasity])
        ]))
    }
}
