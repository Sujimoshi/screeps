import { TaskRequest, TaskRequestQueue } from "./queue";
import { Task, TaskCondition } from "./task";
import { table } from "table";
import { stableMatch } from "../../utils/match";

export { TaskRequest, Task, TaskCondition }

export class TaskManager {
    requests = <TaskRequest[]>[]

    manage (queue: TaskRequestQueue, idleCreeps: Creep[]) {
        const requests = queue.all()

        const ranks = this.ranks(idleCreeps, requests)

        const pairs = stableMatch(requests, idleCreeps, ranks.requests, ranks.creeps)

        for (const [request, creep] of pairs) {
            this.requests.push(request.assign(creep))
        }
    }

    process () {
        this.requests = this.requests.filter(req => req.process())
    }

    ranks (creeps: Creep[], requests: TaskRequest[]) {
        const requestRanks = requests.reduce((tmp, request) => {
            const rankedCreeps = creeps.filter(creep => request.task.satisfiable(creep))
                .map(creep => ({ creep, cost: request.task.getCost(creep) }))
                .sort((a, b) => a.cost - b.cost).map(({ creep }) => creep)

            return tmp.set(request, rankedCreeps)
        }, new Map<TaskRequest, Creep[]>())

        const creepRanks = creeps.reduce((tmp, creep) => {
            const rankedRequests = requests.filter(request => request.task.satisfiable(creep))
                .sort((a, b) => ((b.priority * 1000 - b.task.getCost(creep)) - (a.priority * 1000 - a.task.getCost(creep))))

            return tmp.set(creep, rankedRequests)
        }, new Map<Creep, TaskRequest[]>())

        return {
            requests: requestRanks,
            creeps: creepRanks
        }
    }

    log () {
        console.log(table([
            ['Requester', 'Task', 'Step', 'Creep'],
            ...this.requests.map(el => [el.creator, el.task.name, el.task.step?.name, el.creep])
        ]))
    }
}

