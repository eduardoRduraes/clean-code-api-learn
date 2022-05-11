import { SurveyResultModel } from "@/domain/models/survey-result";

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string) => Promise<any>
}

// export namespace LoadSurveyResultRepository {
//   export type Result = SurveyResultModel
// }
