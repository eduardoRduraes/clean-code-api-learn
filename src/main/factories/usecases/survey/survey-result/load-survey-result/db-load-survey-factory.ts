import { DbLoadSurveyResult } from "@/data/usecases/survey-result/load-survey-result/load-survey-result-controller";
import { LoadSurveyResult } from "@/domain/usecases/load-survey-result";
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository";
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository";


export const makeDbLoadResultSurveys = (): LoadSurveyResult => {
  const loadSurveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(loadSurveyResultMongoRepository, surveyMongoRepository)
}
