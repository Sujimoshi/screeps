import { RoomContext } from "../../room";
import { MemoizeByTick } from "../../utils/memoize";
import { MemoryWindow } from "./MemoryWindow";

export class EconomyAnalyzerRepository {
    instances = new Map<string, EconomyAnalyzer>()

    get = (context: RoomContext) => {
        const instance = this.instances.get(context.room.name)
        if (!instance) this.instances.set(context.room.name, new EconomyAnalyzer(context))
        return this.instances.get(context.room.name)!.initialize(context)
    }
}

export class EconomyAnalyzer {
    prevAvailableEnergyAmount = this.availableEnergyAmount()
    prevSourceAmount = this.sourceAmount()
    supplyWindow = new MemoryWindow<number>(this.context.room.name, 'supply')
    lossesWindow = new MemoryWindow<number>(this.context.room.name, 'looses')
    demandWindow = new MemoryWindow<number>(this.context.room.name, 'demand')

    constructor(public context: RoomContext) {}

    initialize (context: RoomContext) {
        this.context = context
        return this
    }

    sourceAmount () {
        return this.context.sources.reduce((acc, source) => {
            return acc += source.energy
        }, 0)
    }

    harvested () {
        const res = this.prevSourceAmount - this.sourceAmount()
        return res < 0 ? 0 : res
    }

    disappeared () {
        return this.context.droppedEnergyResources.reduce((acc, res) => {
            return acc += Math.ceil(res.amount / 1000)
        }, 0)
    }

    droppedEnergyAmount () {
        return this.context.droppedEnergyResources.reduce((acc, res) => {
            return acc += res.amount
        }, 0)
    }

    containersEnergyAmount () {
        return this.context.containers.reduce((acc, container) =>
            acc += container.store.getUsedCapacity(RESOURCE_ENERGY), 0)
    }

    availableEnergyAmount () {
        return this.droppedEnergyAmount() + this.containersEnergyAmount()
    }

    supply (window: number = 1000) {
        return this.supplyWindow.slice(window).reduce((acc, curr) => {
            return acc += curr
        }, 0)
    }

    looses (window: number = 1000) {
        return this.lossesWindow.slice(window).reduce((acc, curr) => {
            return acc += curr
        }, 0)
    }

    demand (window: number = 1000) {
        return this.demandWindow.slice(window).reduce((acc, curr) => {
            return acc -= curr
        }, 0)
    }

    analyze () {
        this.supplyWindow.push(this.harvested())
        this.lossesWindow.push(this.disappeared())
        this.demandWindow.push(this.availableEnergyAmount() - this.prevAvailableEnergyAmount - (this.harvested() - this.disappeared()))

        this.prevAvailableEnergyAmount = this.availableEnergyAmount()
        this.prevSourceAmount = this.sourceAmount()
    }
}
