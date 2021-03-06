import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller.decorator-factory"
import { makeDbLoadSurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory"
import { makeDbLoadResultSurveys } from "@/main/factories/usecases/survey/survey-result/load-survey-result/db-load-survey-factory"
import { LoadSurveyResultController } from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result."
import { Controller } from "@/presentation/protocols"


export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadResultSurveys())
  return makeLogControllerDecorator(controller)
}
