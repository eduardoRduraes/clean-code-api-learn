import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller.decorator-factory"
import { makeDbLoadSurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-byu-id-factory"
import { makeDbSaveResultSurveys } from "@/main/factories/usecases/survey/survey-result/save-survey-result/db-save-survey-factory"
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller"
import { Controller } from "@/presentation/protocols"


export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveResultSurveys())
  return makeLogControllerDecorator(controller)
}
