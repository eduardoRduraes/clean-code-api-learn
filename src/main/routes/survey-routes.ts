import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-surveys/load-survey-controller-factory'
import { adminAuth } from '@/main/middewares/admin-auth'
import { auth } from '@/main/middewares/auth'

export default (router: Router):void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
