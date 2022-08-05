import { ActionsManager } from "../actions";
import { HarvestAction } from "../actions/harvest";
import { getSources } from "../selectors/room";

export const sourceManager = (manager: ActionsManager) => (room: Room) => {
    const sources = getSources(room)
    sources.forEach(source => {
        manager.push(new HarvestAction(source))
    })

}
