import { LoadSurvey, LoadSurveyRepository, SurveyModel } from "./db-load-surveys-protocols"

export class DbLoadSurveys implements LoadSurvey {
  constructor(private readonly loadSurveyRepository: LoadSurveyRepository) {}
  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll()
    return surveys
  }
}
