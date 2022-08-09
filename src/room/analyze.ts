// import { table } from "table"
// import { RoomContext } from "."
// import { Provider } from "../main"

// class Window<T> {
//     store: T[] = []

//     push(data: T) {
//         this.store.push(data)
//         if (this.store.length > 1000)
//             this.store.shift()
//     }

//     slice(num: number) {
//         if (this.store.length < num) return null
//         return this.store.slice(this.store.length - num)
//     }
// }

// const window = new Window<{ income: number, waste: number, expenses: number }>()
// let prevAmount = 0

// export const roomAnalyzer = (room: RoomContext): Provider => () => {
//     const droppedEnergyAmount = room.droppedEnergyResources.reduce((acc, res) => acc += res.amount, 0)
//     const containersEnergyAmount = room.containers.reduce((acc, container) =>
//         acc += container.store.getUsedCapacity(RESOURCE_ENERGY), 0)
//     const amount = droppedEnergyAmount + containersEnergyAmount

//     const disappeared = room.droppedEnergyResources.reduce((acc, res) => acc += Math.ceil(res.amount / 1000), 0)
//     const harvested = room.sources.reduce((acc, source) => {
//         const diff = source
//         acc += creep.getActiveBodyparts(WORK) * 2
//     }, 0)

//     console.log(table([
//         ['Amount', 'Containerized', 'Dropped'],
//         [amount, containersEnergyAmount, droppedEnergyAmount]
//     ]))

//     const took = amount - prevAmount - (harvested - disappeared)

//     console.log(table([
//         ['Harvested', 'Disappeared', 'Took'],
//         [`+${harvested}`, `-${disappeared}`, took]
//     ]))

//     const oneH = window.slice(1000)
//     const income = oneH ? oneH.reduce((acc, { income }) => acc += income, 0) : 'N/A'
//     const waste = oneH ? oneH.reduce((acc, { waste }) => acc += waste, 0) : 'N/A'
//     const expenses = oneH ? oneH.reduce((acc, { expenses }) => acc += expenses, 0) : 'N/A'
//     console.log(table([
//         ['Income',     'Waste',     'Expenses'],
//         [`+${income}`, `-${waste}`, `-${expenses}`]
//     ]))


//     window.push({ income: harvested, waste: disappeared, expenses: took })
//     prevAmount = amount
//     console.log(window.store.length)
// }

// // income loss waste
