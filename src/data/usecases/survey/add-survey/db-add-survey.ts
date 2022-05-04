import { AddSurveyModel } from "@/domain/usecases/add-survey";
import { AddSurvey, AddSurveyRepository } from "./db-add-survey-protocols";


export class DbAddSurvey implements AddSurvey {

  constructor(private readonly surveyData: AddSurveyRepository){}

  async add (data: AddSurveyModel): Promise<void>{
    await this.surveyData.add(data)
  }
}
