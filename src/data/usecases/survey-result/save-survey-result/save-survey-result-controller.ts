import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";
import { LoadSurveyResultRepository } from "../load-survey-result/load-survey-result-controller-protocols";

export class DbSaveSurveyResult implements SaveSurveyResult  {
  constructor(
    private readonly saveSurveyResult: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository){}
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      await this.saveSurveyResult.save(data)
      const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
      return surveyResult
  }

}
