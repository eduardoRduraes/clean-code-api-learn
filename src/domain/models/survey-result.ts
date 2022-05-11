export type SurveyResultModel = {
  surveyId: string,
  accountId: string,
  answers: SurveyResultAnswerModel[],
  date: Date
}



type SurveyResultAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
}

