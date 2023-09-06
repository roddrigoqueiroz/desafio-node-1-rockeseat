// This class is responsable for reading the body of the HTTP requests

export async function readBody(request, response) {
    const buffer = []

    // I need to read the entire request string in order to get the body
    for await (let bodyChunk of request)
        buffer.push(bodyChunk);
    
    const body = Buffer.concat(buffer).toString()

    request.body = JSON.parse(body)
}