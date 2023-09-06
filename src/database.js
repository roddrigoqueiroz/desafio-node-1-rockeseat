import fs from 'node:fs/promises'
import { URL } from 'node:url';

// gets the url for the db.json file, relative to this file position (due to import.meta.url)
const path = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        this.#database = fs.readFile(path, 'utf8')
        .then(file => {
            this.#database = JSON.parse(file);
        })
        .catch(() => {
            this.#persist();
        })
    }

    #persist() {
        fs.writeFile(path, JSON.stringify(this.#database))
    }

    // table: string
    select(table, query) {
        let data = Array.isArray(this.#database[table]) ? this.#database[table] : [];

        if (query) {
            data = data.filter( row => {
                return query.some( ([key, value]) => {
                    try {
                        return row[key].toLowerCase().includes(value.toLowerCase())
                    } catch {
                        return []
                    }
                })
            })
        }

        return data;
    }

    insert(table, data) {
        if(!data)
            return []

        if(Array.isArray(this.#database[table]))
            this.#database[table].push(data);
        else
            this.#database[table] = [data];

        this.#persist();
    }

    update(table, id, data) {
        if (!data)
            return null;

        const element = this.#database[table].find(element => id === element.id)

        if (element) {
            this.#database[table][element] = { id, ...data }
            this.#persist()
        }
    }

    delete(table, id) {
        const index = this.#database[table].findIndex(element => id === element.id)

        if (index > -1) {
            this.#database[table].splice(index, 1)
            this.#persist
        }
    }
}