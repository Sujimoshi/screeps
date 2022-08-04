export const handle = (res: number, docs: string): boolean => {
    if (res !== 0) {
        console.log(new Error(`Return: ${res}. Docs: https://docs.screeps.com/api/#${docs}`))
        return false
    }
    return true
}
