import { Express } from 'express'
import { bodyParser } from '../middewares/body-parser'
import { cors } from '../middewares/cors'
import { contentType } from '../middewares/content-type'

export default (app: Express):void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
