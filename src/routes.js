import { Task } from "./task.js";
import { Database } from "./database.js";
import { routeHandler } from "./utils/route-handler.js";
import { queryHandler } from "./utils/query-handler.js";
import { readCSV } from './csv/read-csv.js';

const db = new Database();

function getElementByID(table, id) {
    return db.select(table).find(element => element.id === id)
}

export const routes = [
    {
        // TODO: add query params
        method: 'GET',
        path: routeHandler('/tasks'),
        handler: (request, response) => {
            const query = request.params.groups.query ? queryHandler(request.params.groups.query) : null

            const data = db.select('tasks', query)

            return response.writeHead(200).end(JSON.stringify(data));
        }
    },
    {
        method: 'POST',
        path: routeHandler('/tasks'),
        handler: async (request, response) => {
            let tasks = []

            const query = request.params.groups.query ? queryHandler(request.params.groups.query) : null
            
            if (query && query[0][0] === 'csv' && query[0][1] === 'true') {
                tasks = await readCSV()
            }
            else if (request.body !== [])
                tasks.push(request.body)

            for (const task of tasks) {
                try {
                    db.insert('tasks', new Task(task['title'], task['description']));
                } catch (error) {
                    console.log(error)
                }
            }

            return response.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: routeHandler('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params.groups

            let element = getElementByID('tasks', id)

            if(!element)
                return response.writeHead(404).end('ID not found')

            element.title = request.body.title ?? element.title
            element.description = request.body.description ?? element.description
            element.update = new Date()

            db.update('tasks', id, element)

            return response.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: routeHandler('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params.groups

            let element = getElementByID('tasks', id)

            if(!element)
                return response.writeHead(404).end('ID not fouconst nd')

            db.delete('tasks', id)

            return response.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: routeHandler('/tasks/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params.groups

            let element = getElementByID('tasks', id)

            if(!element)
                return response.writeHead(404).end('ID not found')

            if (element.completed_at)
                element.completed_at = null
            else
                element.completed_at = new Date()
            
            element.updated_at = new Date()

            return response.writeHead(204).end()
        }
    }
]