import express from 'express'
import setupMiddlewares from './middewares'
const app = express()
setupMiddlewares(app)
export { app }
