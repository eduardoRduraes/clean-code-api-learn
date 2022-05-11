import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";

export class DbSaveSurveyResult implements SaveSurveyResult  {
  constructor(private readonly saveSurveyResult: SaveSurveyResultRepository){}
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      const survey = await this.saveSurveyResult.save(data)
      return survey
  }

}
