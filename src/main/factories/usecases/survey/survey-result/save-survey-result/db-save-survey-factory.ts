import { DbSaveSurveyResult } from "@/data/usecases/survey-result/save-survey-result/save-survey-result-controller";
import { SaveSurveyResult } from "@/domain/usecases/save-survey-result";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";


export const makeDbSaveResultSurveys = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
