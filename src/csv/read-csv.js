import { parse } from 'csv-parse'
import fs from 'fs'
import { URL } from 'node:url'

const path = new URL('data.csv', import.meta.url);

export async function readCSV() {
    return new Promise((resolve, reject) => {
        let newTasks = []

        const readStream = fs.createReadStream(path, 'utf8')

        // Creates a parser and connects it with the readStream
        // readStream is a readable stream, so calling pipe on it has the effect of reading it
        // on the other hand, parse is a writable stream, so it can write the values read from the stream
        const parser = readStream.pipe(parse({
            columns: true
        }))

        parser.on('data', (chunk) => {
            newTasks.push(chunk)
        })
        parser.on('end', () => {
            parser.end()
            readStream.close()
            resolve(newTasks)
        })
        parser.on('error', (error) => {
            reject(error)
        })
    })
}