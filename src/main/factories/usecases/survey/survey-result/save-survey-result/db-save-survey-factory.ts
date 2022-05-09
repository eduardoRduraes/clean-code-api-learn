import { DbSaveSurveyResult } from "@/data/usecases/survey-result/save-survey-result/save-survey-result-controller";
import { SaveSurveyResult } from "@/domain/usecases/save-survey-result";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";


export const makeDbSaveResultSurveys = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
