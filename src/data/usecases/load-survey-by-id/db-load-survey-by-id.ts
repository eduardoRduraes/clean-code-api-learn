import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-surveys-by-id-repository";
import { SurveyModel } from "../load-surveys/db-load-surveys-protocols";

export class DbLoadSurveyById implements LoadSurveyByIdRepository {

  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

  async loadById(surveyId: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(surveyId)
    return null
  }

}
