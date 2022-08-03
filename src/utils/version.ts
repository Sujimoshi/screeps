export const version = () => '[VI]{version} - {date}[/VI]'

export const updateVersion = () => {
    Memory.version = version()
}

export const isNewVersion = () => {
    return Memory.version !== version()
}
