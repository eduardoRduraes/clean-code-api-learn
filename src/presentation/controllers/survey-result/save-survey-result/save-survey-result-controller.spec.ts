import MockDate from 'mockdate'
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { forbidden, HttpRequest, InvalidParamError, LoadSurveyById, ok, SaveSurveyResult, SaveSurveyResultParams, serverError, SurveyModel, SurveyResultModel } from "./save-survey-result-controller-protocols"


type SutTypes = {
  sut: SaveSurveyResultController,
  loadSurveyByIdStub: LoadSurveyById,
  saveSurveyResultStub: SaveSurveyResult
}

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

describe('SaveSurveyResult Controller', () => {
  const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSaveSurveyResult()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub,saveSurveyResultStub)
    return {
      sut,
      loadSurveyByIdStub,
      saveSurveyResultStub
    }
  }

  const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
      async loadById(id: string): Promise<SurveyModel>{
        return new Promise(resolve=>resolve(makeFakeSurvey()))
      }
    }
    return new LoadSurveyByIdStub()
  }

  const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return new Promise(resolve=>resolve(makeFakeSurveyResult()))
      }
    }
    return new SaveSurveyResultStub()
  }

  const makeFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_survey_id'
    },
    body:{
      answer:'any_answer'
    },
    accountId: 'any_account_id'
  })

  const makeFakeSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image:'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  const makeFakeSurveyResult = (): SurveyResultModel => ({
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answers: [{
      answer: 'any_answer',
      count: 1,
      percent: 50
    },{
      image: 'any_image',
      answer: 'other_answer',
      count: 1,
      percent: 80
    }],
    date: new Date()
  })

  test('Shoul call LoadSurveyById with correct values',async () => {
    const { sut,loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Shoul return 403 if LoadSurveyById returns null',async () => {
    const { sut,loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve=> resolve(null)))
    const survey = await sut.handle(makeFakeRequest())
    expect(survey).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const {sut, loadSurveyByIdStub} = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body:{
        answer:'wrong_answer'
      }
  })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Shoul call SaveSurveyResult with correct values',async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
       surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const {sut, saveSurveyResultStub} = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  })
})
