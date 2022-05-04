import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";

export class DbSaveSurveyResult implements SaveSurveyResult  {
  constructor(private readonly saveSurveyResult: SaveSurveyResultRepository){}
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      const survey = await this.saveSurveyResult.save(data)
      return null
  }

}
