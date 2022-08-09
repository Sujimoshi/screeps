import { RoomContext } from "../../room"

export interface LoopContext {
    [key: string]: RoomContext
  }

export class Container<T extends Record<string, any>> {
    dependencies = <T>{}

    context: LoopContext = {}

    singleton <K extends keyof T>(key: K, provider: (deps: T, container: this) => T[K]) {
        this.dependencies[key] = provider(this.dependencies, this)
    }

    factory <K extends keyof T>(key: K, provider: (deps: T, container: this) => T[K]) {
        Object.defineProperty(this.dependencies, key, {
            get: () => provider(this.dependencies, this)
        })
    }

    get <K extends keyof T>(key: K): T[K] {
        return this.dependencies[key]
    }

    use (provider: (deps: T, container: this) => void) {
        provider(this.dependencies, this)
    }
}
