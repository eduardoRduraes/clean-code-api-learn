
import { LoadSurvey, LoadSurveyController, ok, SurveyModel } from './load-survey-controller-protocols'
import MockDate from 'mockdate'

interface SutTypes {
  sut: LoadSurveyController,
  loadSurveyStub: LoadSurvey
}

describe('LoadSurvey Controller', () => {

  beforeAll(()=>{
    MockDate.set(new Date('2022-4-25'))
  })

  afterAll(()=>{
    MockDate.reset()
  })

  const makeSut = (): SutTypes => {
    const loadSurveyStub = makeLoadSurveyController()
    const sut = new LoadSurveyController(loadSurveyStub)
    return {
      sut,
      loadSurveyStub
    }
  }

  const makeLoadSurveyController = (): LoadSurvey => {
    class LoadSurveyStub implements LoadSurvey {
      async load(): Promise<SurveyModel[]> {
        return new Promise(resolve=>resolve(makeFakeSurveys()))
      }
    }
    return new LoadSurveyStub()
  }

  const makeFakeSurveys = (): SurveyModel[] => {
    return [
     {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image:'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    },
     {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image:'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
  ]
  }

  test('Should call LoadSurveys', async () => {
    const {sut, loadSurveyStub} = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
})
