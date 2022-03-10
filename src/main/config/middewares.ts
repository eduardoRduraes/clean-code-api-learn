import { Express } from 'express'
import { bodyParser } from '../middewares/body-parser'

export default (app: Express):void => {
  app.use(bodyParser)
}
