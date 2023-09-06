export function routeHandler(path) {
    const regex = /:([a-zA-Z0-9]+)/g

    const stringReplacedPathWithRegex = path.replaceAll(regex, '(?<$1>[a-zA-Z0-9\-_]+)')

    // the ?$ at the end of the regex means that the <query> group is optional
    // and it has to end with the query group (? = optional, $ = has to end)
    return new RegExp(`^${stringReplacedPathWithRegex}(?<query>\\?(.*))?$`)
}