import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-surveys-by-id-repository"
import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from "./load-survey-result-controller-protocols"


export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository:LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

    async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if(!surveyResult){
      const surveyModel = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: surveyModel.id,
        question: surveyModel.question,
        answers: surveyModel.answers.map(answer => Object.assign({}, answer, {count:0, percent:0})),
        date: surveyModel.date,

      }
    }
    return surveyResult
  }
}
