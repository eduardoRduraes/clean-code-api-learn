import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, LoadSurveyResult, ok, serverError} from "./load-survey-result-controller-protocols"

export class LoadSurveyResultController implements Controller {

  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
    ){}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
    const { params } = httpRequest
    try {
      const survey = await this.loadSurveyById.loadById(params.surveyId)
      if(!survey){
        return forbidden(new InvalidParamError(params.surveyId))
      }
      const surveyResult = await this.loadSurveyResult.load(params.surveyId)
    return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }

}
