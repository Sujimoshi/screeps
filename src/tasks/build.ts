import { Task } from "../core/TaskManager";
import { HasBodyPart, HasUsedResourceCapacity, IsInRangeTo } from "./conditions";

export class BuildTask extends Task {
    name = 'BuildTask'

    constructor(public site: ConstructionSite) {
        super()
    }

    cost = (creep: Creep) => creep.pos.getRangeTo(this.site.pos)

    conditions = (creep: Creep) => [
        new HasBodyPart(WORK),
        new IsInRangeTo(this.site.pos, 3),
        new HasUsedResourceCapacity(RESOURCE_ENERGY, '>', 0),
    ]

    action = (creep: Creep) => creep.build(this.site)
}
