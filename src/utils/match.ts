//@ts-ignore
import { Person, stableMarriage } from 'stable-marriage'

export const stableMatch = <T, V>(left: T[], right: V[], leftRanks: Map<T, V[]>, rightRanks: Map<V, T[]>): [T, V][] => {
    const boys = left.map((dat) => new Person(dat))
    const girls = right.map((dat) => new Person(dat))

    for (const boy of boys) {
      boy.generatePreferences(leftRanks.get(boy.name)?.map(girl => {
        return girls.find(girlPerson => girlPerson.name === girl)
      }))
    }

    for (const girl of girls) {
      girl.generatePreferences(rightRanks.get(girl.name)?.map(boy => {
        return boys.find(boyPerson => boyPerson.name === boy)
      }))
    }

    stableMarriage(boys)

    return boys.map(boy => [boy.name, boy.fiance?.name]).filter(([l, r]) => !!l && !!r) as any
}
