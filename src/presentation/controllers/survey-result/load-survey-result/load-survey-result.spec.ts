
import MockDate from 'mockdate'
import { forbidden, HttpRequest, InvalidParamError, LoadSurveyById, LoadSurveyResult, ok, serverError, SurveyModel, SurveyResultModel } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result.'

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

type SutTypes = {
  sut: LoadSurveyResultController,
  loadSurveyByIdStub: LoadSurveyById,
  loadSurveyResultStub: LoadSurveyResult
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'survey_id',
  question: 'any_question',
  answers: [{
    image:'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  },
  body:{
    answer:'any_answer'
  },
  accountId: 'any_account_id'
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
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

const makeSut= (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const loadSurveyResultStub = makeLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub,loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
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
const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    load(surveyId: string): Promise<SurveyResultModel> {
      return new Promise(resolve=>resolve(makeFakeSurveyResult()))
    }
  }
  return new LoadSurveyResultStub()
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const {sut,loadSurveyByIdStub} = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Shoul return 403 if LoadSurveyById returns null', async () => {
    const {sut,loadSurveyByIdStub} = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual(forbidden(new InvalidParamError('survey_id')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const {sut,loadSurveyByIdStub} = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct value', async () => {
    const {sut, loadSurveyResultStub} = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const {sut,loadSurveyResultStub} = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  })
})
