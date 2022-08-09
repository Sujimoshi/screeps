import { App } from "./main"

export {}

declare global {
    interface CreepMemory {
        room: string
    }

    interface RoomMemory {
        roads?: [string, string][]
        windows: Record<string, any[]>
    }

    namespace NodeJS {
        interface Global {
            app: App
        }
    }
}
