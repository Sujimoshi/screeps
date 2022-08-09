import { Task } from "../core/TaskManager";
import { HasUsedResourceCapacity, HasBodyPart, IsInRangeTo } from "./conditions";

export class UpgradeTask extends Task {
    name = 'UpgradeTask'

    constructor(public controller: StructureController) {
        super()
    }

    conditions = () => [
        new HasBodyPart(WORK),
        new HasUsedResourceCapacity(RESOURCE_ENERGY, '>', 0),
        new IsInRangeTo(this.controller.pos, 3),
    ]

    action = (creep: Creep) => creep.upgradeController(this.controller)

    cost = (creep: Creep) => creep.pos.getRangeTo(this.controller)
}
