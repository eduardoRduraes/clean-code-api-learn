import express,{ Express } from 'express'
import setupMiddlewares from './middewares'
import setupReoutes from './routes'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupMiddlewares(app)
  setupReoutes(app)
  return app;
}

