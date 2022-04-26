export interface SurveyModel {
  id: string,
  image?:string,
  question: string,
  answers: SurveyAnswerModel[],
  date: Date
}

export interface SurveyAnswerModel {
  image?: string,
  answer: string
}
