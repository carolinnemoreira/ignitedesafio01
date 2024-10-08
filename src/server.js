import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './middlewares/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async(req,res) => { 
    const { method, url } = req

    await json(req,res)

    const route = routes.find(route => {
        //Na questão de rota vai ser testado se a regex criada bate com a url que está sendo recebida
        return route.method === method && route.path.test(url)
    })
    
    if(route) {
        
        const routeParams = req.url.match(route.path)
        //console.log(routeParams.groups)
        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}
    
        return route.handler(req,res)
    }
    
        return res.writeHead(404).end("Not found!")

})

server.listen(3333) 