import { ActionsManager } from "../actions";
import { UpgradeAction } from "../actions/upgrade";

export const controllerManager = (manager: ActionsManager) => (room: Room) => {
    if (room.controller && room.controller.level < 8) {
        manager.push(
            new UpgradeAction(room.controller),
            new UpgradeAction(room.controller),
            new UpgradeAction(room.controller),
        )
    }
}
