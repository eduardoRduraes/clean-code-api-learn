
import { LoadSurvey, LoadSurveyController, SurveyModel } from './load-survey-controller-protocols'
import MockDate from 'mockdate'


describe('LoadSurvey Controller', () => {
  const makeSut = ():any => {
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

  beforeAll(()=>{
    MockDate.set(new Date('2022-4-25'))
  })

  afterAll(()=>{
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const {sut, loadSurveyStub} = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
