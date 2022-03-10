import express from 'express'
import setupMiddlewares from './middewares'
import setupReoutes from './routes'
const app = express()
setupMiddlewares(app)
setupReoutes(app)

export { app }
