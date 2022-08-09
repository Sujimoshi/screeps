import { RoomContext } from ".";
import { Provider } from "../main";

export const towerTasks = (context: RoomContext): Provider => () => {
    if (context.enemies.length) {
        context.towers.forEach(tower => {
            const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if (!enemy) return
            tower.attack(enemy)
        })
    } else {
        context.towers.forEach(tower => {
            const [broken] = [...context.paths, ...context.containers]
                .filter(el => el.hits < el.hitsMax)
                .sort((a, b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits))
            if (!broken) return
            tower.repair(broken)
        })
    }
}
