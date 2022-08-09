export class MemoryWindow<T> {
    constructor(public room: string, public name: string) {}

    get memory (): T[] {
        if (!Memory.rooms[this.room].windows) Memory.rooms[this.room].windows = {}
        return Memory.rooms[this.room].windows[this.name] = Memory.rooms[this.room].windows[this.name] || []
    }

    push (data: T) {
        this.memory.push(data)
        if (this.memory.length > 1000) this.memory.shift()
    }

    slice (num: number) {
        return this.memory.slice(this.memory.length - num)
    }
}
