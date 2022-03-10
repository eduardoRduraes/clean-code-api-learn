import { Express } from 'express'
import { bodyParser } from '../middewares/body-parser'
import { cors } from '../middewares/cors'

export default (app: Express):void => {
  app.use(bodyParser)
  app.use(cors)
}
