// ?key=value&

export function queryHandler(query) {
    const result = query.substring(1).split('&').reduce((accumulator, current) => {
        const splitOnKeyValue = current.replaceAll('%20', ' ').split('=')

        accumulator.push(splitOnKeyValue)

        return accumulator
    }, [])

    return result;
}