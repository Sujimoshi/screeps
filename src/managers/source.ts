import { ActionsManager } from "../actions";
import { MineAction } from "../actions/mine";
import { getSources } from "../data/room";

export const sourceManager = (manager: ActionsManager) => (room: Room) => {
    const sources = getSources(room)
    sources.forEach(source => {
        manager.push(new MineAction(source))
    })

}
