import { SurveyResultModel } from "@/domain/models/survey-result";

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel
}
