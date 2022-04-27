import { SurveyResultModel } from "../models/survey-result"


export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export type SaveSurveyResult = {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
