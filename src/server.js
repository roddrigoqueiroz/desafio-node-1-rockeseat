import http from 'node:http'
import { routes } from './routes.js';
import { readBody } from './middlewares/body.js';

const server = http.createServer(async(request, response) => {
    const { method, url } = request;

    try {
        await readBody(request, response)
    } catch {
        // empty body
        request.body = []
    }

    const route = routes.find(route => {
        return route.method === method && route.path.test(url); // tests if the url is in the regex expected parameters
    })

    if (route) {
        request.params = url.match(route.path);

        return await route.handler(request, response);
    }
    
    return response.writeHead(404).end('Not found')
})

server.listen(3333);