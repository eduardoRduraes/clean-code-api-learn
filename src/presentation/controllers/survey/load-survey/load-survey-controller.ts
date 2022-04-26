import { Controller, HttpRequest, HttpResponse, LoadSurvey, ok, serverError } from "./load-survey-controller-protocols";

import {} from '../../../../domain/usecases/load-survey'
export class LoadSurveyController implements Controller {

  constructor(private readonly loadSurvey: LoadSurvey){}

  async handle(httpRequest: HttpRequest):Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
