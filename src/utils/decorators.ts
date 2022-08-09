export function GameRef() {
    return function (target: any, key: string) {
        Object.defineProperty(target, key, {
            get: function () {
                return Game.getObjectById(this[`__${key}__`])
            },
            set: function (val: { id: Id<_HasId> }) {
                this[`__${key}__`] = val?.id
            }
        })
    }
}
