export type SurveyModel = {
  id: string,
  image?:string,
  question: string,
  answers: SurveyAnswerModel[],
  date: Date
}

export type SurveyAnswerModel = {
  image?: string,
  answer: string
}

