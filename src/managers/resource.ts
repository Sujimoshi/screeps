import { ActionsManager } from "../actions";
import { PickupAction } from "../actions/pickup";
import { getResources } from "../selectors/room";

export const resourceManager = (manager: ActionsManager) => (room: Room) => {
    const resources = getResources(room, RESOURCE_ENERGY)
    for (const resource of resources) {
        manager.push(new PickupAction(resource))
    }
}
