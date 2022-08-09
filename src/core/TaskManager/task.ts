import { MemoizeByTick } from "../../utils/memoize"

export abstract class Task {
    abstract name: string

    step: Task | null = null

    abstract cost: (creep: Creep) => number
    abstract conditions: (creep: Creep) => TaskCondition[]
    abstract action: (creep: Creep) => number

    @MemoizeByTick()
    satisfiable(creep: Creep): boolean {
        if (creep.spawning) return false
        return this.conditions(creep).every(cond => cond.satisfiable(creep))
    }

    @MemoizeByTick()
    getCost (creep: Creep) {
        return this.cost(creep)
    }

    run (creep: Creep): boolean {
        if (!this.satisfiable(creep)) return false
        const unmet = this.conditions(creep).find(cond => !cond.satisfied(creep))
        if (unmet) {
            this.step = unmet.satisfy(creep)!
            return this.step.run(creep)
        }
        return this.action(creep) === 0
    }
}

export abstract class TaskCondition {
    abstract satisfied: (creep: Creep) => boolean;
    abstract satisfy: (creep: Creep) => Task | null;

    satisfiable (creep: Creep): boolean {
        if (this.satisfied(creep)) return true
        const toSatisfyTask = this.satisfy(creep)
        if (!toSatisfyTask) return false
        return toSatisfyTask.satisfiable(creep)
    }
}
