import { RoomContext } from ".";
import { Provider } from "../main";
import { AttackTask } from "../tasks/attack";
import { BuildTask } from "../tasks/build";
import { HarvestTask } from "../tasks/harvest";
import { PickupTask } from "../tasks/pickup";
import { TransferTask } from "../tasks/transfer";
import { UpgradeTask } from "../tasks/upgrade";
import { WithdrawTask } from "../tasks/withdraw";

export const creepTasksCreator = (context: RoomContext): Provider => ({ taskManager }) => {
    const idleCreeps = context.creeps.filter(creep => !taskManager.requests.some(req => req.creep === creep))
    if (!idleCreeps.length) return

    context.sources.forEach(source => {
        const hasMiner = taskManager.requests.some(req => {
            return req.creator === source && req.creep!.name.includes('miner')
        })
        if (source.energy > 0 && !hasMiner) {
            context.taskQueue.add({
                creator: source,
                task: new HarvestTask(source),
                priority: 100,
                capasity: source.energy
            })
        }
    })

    const containersRanks = context.containers.sort((a, b) => a.store.energy - b.store.energy)
    context.containers.forEach(container => {
        if (container.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            context.taskQueue.add({
                creator: container,
                task: new WithdrawTask(container, RESOURCE_ENERGY),
                priority: 150 + containersRanks.findIndex(c => c === container),
                capasity: container.store.getUsedCapacity(RESOURCE_ENERGY)
            })
        }
    })

    const resourceRanks = context.droppedEnergyResources.sort((a, b) => a.amount - b.amount)
    for (const resource of context.droppedEnergyResources) {
        context.taskQueue.add({
            creator: resource,
            task: new PickupTask(resource),
            priority: 200 + resourceRanks.findIndex(res => res === resource),
            capasity: resource.amount
        })
    }

    if (context.room.controller && context.room.controller!.level <= 8) {
        context.taskQueue.add({
            creator: context.room.controller,
            task: new UpgradeTask(context.room.controller),
            priority: 300,
            capasity: context.room.controller.progress - context.room.controller.progressTotal
        })
    }

    context.constructionSites.forEach(site => {
        context.taskQueue.add({
            creator: site,
            task: new BuildTask(site),
            priority: 400,
            capasity: site.progress - site.progressTotal
        })
    })

    context.towers.forEach(tower => {
        if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            context.taskQueue.add({
                creator: tower,
                task: new TransferTask(tower, RESOURCE_ENERGY),
                priority: 500,
                capasity: -tower.store.getFreeCapacity(RESOURCE_ENERGY)
            })
        }
    })

    context.spawns.forEach(spawn => {
        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            context.taskQueue.add({
                creator: spawn,
                task: new TransferTask(spawn, RESOURCE_ENERGY),
                priority: 600,
                capasity: -spawn.store.getFreeCapacity(RESOURCE_ENERGY)
            })
        }
    })

    context.extensions.forEach(ext => {
        if (ext.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            context.taskQueue.add({
                creator: ext,
                task: new TransferTask(ext, RESOURCE_ENERGY),
                priority: 600,
                capasity: -ext.store.getFreeCapacity(RESOURCE_ENERGY)
            })
        }
    })

    context.enemies.forEach(enemy => {
        context.taskQueue.add({
            creator: enemy,
            task: new AttackTask(enemy),
            priority: 700,
            capasity: 0
        })
    })

    taskManager.manage(context.taskQueue, idleCreeps)

    // taskManager.log()
    // context.taskQueue.log()
}
