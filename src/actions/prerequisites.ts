import { Prerequisite } from "."
import { MoveAction } from "./move"

export class CreepHaveBodyPart extends Prerequisite {
    constructor(public part: BodyPartConstant) {
        super()
    }

    meets = (creep: Creep) => creep.getActiveBodyparts(this.part) > 0

    toMeet = () => null
}

export class CreepIsInRangeTo extends Prerequisite {
    constructor(public pos: RoomPosition, public range: number) {
        super()
    }

    meets = (creep: Creep) => {
        const res = creep.pos.inRangeTo(this.pos, this.range)
        return res
    }

    toMeet = () => new MoveAction(this.pos)
}

export class CreepResourceCapacity extends Prerequisite {
    constructor(
        public resourceType: ResourceConstant,
        public type: '<' | '>' | '<=' | '>=',
        public capacityInPercents: number
    ) {
        super()
    }

    meets = (creep: Creep) => {
        const usedCapacity = creep.store.getUsedCapacity(this.resourceType)
        const capacityPercent = creep.store.getCapacity(this.resourceType) * this.capacityInPercents
        return {
            '>': usedCapacity > capacityPercent,
            '<': usedCapacity < capacityPercent,
            '>=': usedCapacity >= capacityPercent,
            '<=': usedCapacity <= capacityPercent,
        }[this.type]
    }

    toMeet = (creep: Creep) => {
        return null
    }

}
