import { TaskCondition } from "../core/TaskManager"
import { MoveTask } from "./move"
import { WaitTask } from "./wait"

export class CanMove extends TaskCondition {
    satisfied = (creep: Creep) => creep.fatigue <= 0

    satisfy = () => new WaitTask()
}

export class HasBodyPart extends TaskCondition {
    constructor(public part: BodyPartConstant) {
        super()
    }

    satisfied = (creep: Creep) => creep.getActiveBodyparts(this.part) > 0

    satisfy = () => null
}

export class IsInRangeTo extends TaskCondition {
    constructor(public pos: RoomPosition, public range: number) {
        super()
    }

    satisfied = (creep: Creep) => creep.pos.inRangeTo(this.pos, this.range)

    satisfy = () => new MoveTask(this.pos)
}

export class HasUsedResourceCapacity extends TaskCondition {
    constructor(
        public resourceType: ResourceConstant,
        public type: '<' | '>' | '<=' | '>=',
        public capacityInPercents: number
    ) {
        super()
    }

    satisfied = (creep: Creep) => {
        const usedCapacity = creep.store.getUsedCapacity(this.resourceType)
        const capacityPercent = creep.store.getCapacity(this.resourceType) * this.capacityInPercents
        return {
            '>': usedCapacity > capacityPercent,
            '<': usedCapacity < capacityPercent,
            '>=': usedCapacity >= capacityPercent,
            '<=': usedCapacity <= capacityPercent,
        }[this.type]
    }

    satisfy = (creep: Creep) => null

}
