import { table } from "table";
import { getCreeps } from "../selectors/room";

export abstract class Prerequisite {
    abstract meets: (creep: Creep) => boolean; // Does creep meet prerequisite?
    abstract toMeet: (creep: Creep) => Action | null; // What would it take for creep to meet prerequisite?

    meetable (creep: Creep): boolean {
        if (this.meets(creep)) return true
        const toMeetAction = this.toMeet(creep)
        if (!toMeetAction) return false
        return toMeetAction.meetable(creep)
    }

    meetCost (creep: Creep): number {
        if (this.meets(creep)) return 0
        const toMeetAction = this.toMeet(creep)
        if (!toMeetAction) return -1
        return toMeetAction.meetCost(creep)
    }
}

export abstract class Action {
    constructor(public name: string) {}

    creep: Creep | null = null
    subAction: Action | null = null

    abstract prereqs: (creep: Creep) => Prerequisite[];
    abstract action: (creep: Creep) => boolean; // Action complete?
    abstract cost: (creep: Creep) => number // Cost in number of ticks

    meets(creep: Creep) {
        return this.prereqs(creep).every(prereq => prereq.meets(creep))
    }

    meetable(creep: Creep) {
        if (creep.spawning) return false
        return this.prereqs(creep).every(prereq => prereq.meetable(creep))
    }

    meetCost(creep: Creep): number {
        if (creep.spawning) return -1
        const prereqsCosts = this.prereqs(creep).map((prereq) => prereq.meetCost(creep))
        if (prereqsCosts.some(el => el < 0)) return -1
        return this.cost(creep) + prereqsCosts.reduce((acc, cost) => acc + cost, 0)
    }

    assign(creep: Creep) {
        this.creep = creep
    }

    getAction(creep: Creep): Action | null {
        this.creep = creep
        if (this.meets(creep)) return this

        const firstPrereqThatNotMeets = this.prereqs(creep).find(pre => !pre.meets(creep))

        this.subAction = firstPrereqThatNotMeets!.toMeet(creep)!.getAction(creep)

        return this.subAction
    }
}

export class ActionsManager {
    actions: Action[] = []
    creeps: Creep[] = getCreeps(this.room)
    logs: any[] = [['Action', 'SubAction', 'Creep']]

    constructor(public room: Room) {}

    push(...action: Action[]) {
        this.actions.push(...action)
    }

    log() {
        const ranks = this.ranks()
        console.table(this.actions.map(action => {
            return [
                action.name,
                action.subAction?.name || '-',
                action.creep?.name || '-',
                ranks.actions.get(action)!
            ]
        }))
    }

    process() {
        this.actions.forEach((action, i) => {
            if (!this.creeps.length) this.logs.push([action.name, '', ''])
            for (const creep of this.creeps) {
                if (action.meetable(creep)) {
                    this.creeps = this.creeps.filter(c => creep.name !== c.name)
                    const subAction = action.getAction(creep)
                    subAction?.action(creep)
                    break;
                }
            }
        })
    }

    ranks () {
        const preRanks = this.actions.reduce((tmp, action) => {
            const creepRanks = getCreeps(this.room).map(creep => {
                const cost = action.meetCost(creep)
                tmp.creeps.set(creep, [...tmp.creeps.get(creep) || [], { action, cost }])
                return { creep, cost }
            })
            tmp.actions.set(action, creepRanks.filter(el => el.cost >= 0).sort((a, b) => a.cost - b.cost).map(({ creep }) => creep))
            return tmp
        }, {
            actions: new Map<Action, Creep[]>(),
            creeps: new Map<Creep, { action: Action, cost: number }[]>(),
        })

        const ranks = {
            actions: preRanks.actions,
            creeps: new Map([...preRanks.creeps.entries()].map(([creep, ranks]) => [
                creep, ranks.filter(el => el.cost >= 0).sort((a, b) => a.cost - b.cost).map(({ action }) => action)
            ]))
        }
        return ranks
    }
}
