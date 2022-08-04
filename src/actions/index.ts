import { getCreeps } from "../data/room";
import { table } from 'table'

export interface Request {
    task: Action;
    status: "PENDING" | "INPROCESS" | "COMPLETE"
}

export abstract class Prerequisite {
    abstract meets: (creep: Creep) => boolean; // Does creep meet prerequisite?
    abstract toMeet: (creep: Creep) => Action | null; // What would it take for creep to meet prerequisite?

    meetable (creep: Creep): boolean {
        if (this.meets(creep)) return true
        const toMeetAction = this.toMeet(creep)
        if (!toMeetAction) return false
        return toMeetAction.meetable(creep)
    }
}

export abstract class Action {
    constructor(public name: string) {}

    abstract prereqs: (creep: Creep) => Prerequisite[];
    abstract action: (creep: Creep) => boolean; // Action complete?
    abstract cost: (creep: Creep) => number // Cost in number of ticks

    meets(creep: Creep) {
        return this.prereqs(creep).every(prereq => prereq.meets(creep))
    }

    meetable(creep: Creep) {
        return this.prereqs(creep).every(prereq => prereq.meetable(creep))
    }

    getAction(creep: Creep): Action | null {
        if (this.meets(creep)) return this

        const firstPrereqThatNotMeets = this.prereqs(creep).find(pre => !pre.meets(creep))

        return firstPrereqThatNotMeets!.toMeet(creep)!.getAction(creep)
        // const prereqs = this.prereqs(creep)
        // if (prereqs.every(prereq => prereq.meets(creep))) return this.action(creep)
        // const prereq = prereqs.find(pre => !pre.meets(creep))
    }
}

export class ActionsManager {
    actions: Action[] = []
    creeps: Creep[] = getCreeps(this.room)

    constructor(public room: Room) {}

    push(...action: Action[]) {
        this.actions.push(...action)
    }

    process() {
        this.actions.forEach((action, i) => {
            for (const creep of this.creeps) {
                if (action.meetable(creep)) {
                    this.creeps = this.creeps.filter(c => creep.name !== c.name)
                    const subAction = action.getAction(creep)
                    console.log(`${action.name}-${i} -> ${subAction?.name} -> ${creep.name}`)
                    subAction?.action(creep)
                    break;
                }
            }
        })
    }
}
