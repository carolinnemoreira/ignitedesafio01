import path from 'node:path'
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()
export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            //console.log(req.query)
            const { title, description } = req.query
            //Só envio o objeto search caso haja algo dentro. Senão envio null.
            const tasks = database.select('tasks', title ? {
                title: title
            } : description ? {
                description: description
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title is required' }),
                )
            }

            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'description is required' })
                )
            }


            const created_at = new Date()
            const updated_at = new Date()
            const completed_at = null
            const task = {
                id: randomUUID(),
                title,
                description,
                created_at,
                updated_at,
                completed_at
            }

            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            //console.log(req.params)
            const { id } = req.params
            const { title, description } = req.body

            if (!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title or description are required' })
                )
            }

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end("Esse ID não existe")
            }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date()
            })


            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            //console.log(req.params)
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end("Esse ID não existe")
            }



            database.partialUpdate('tasks', id)



            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            //console.log(req.params)
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end("Esse ID não existe")
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
]