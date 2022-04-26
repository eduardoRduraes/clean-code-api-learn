import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveyRepository, SurveyModel } from './db-load-surveys-protocols'

interface SutTypes {
  sut: DbLoadSurveys,
  loadSurveyRepositoryStub: LoadSurveyRepository
}

describe('DbLoadSurveys', () => {
  const makeSut = (): SutTypes => {
    const loadSurveyRepositoryStub = makeLoadSurveyRepository()
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
    return {
      sut,
      loadSurveyRepositoryStub
    }
  }

  const makeLoadSurveyRepository = (): LoadSurveyRepository =>{
    class LoadSurveyRepositoryStub implements LoadSurveyRepository{
      async loadAll (): Promise<SurveyModel[]> {
        return new Promise(resolve=>resolve(makeFakeSurveys()))
      }
    }

    return new LoadSurveyRepositoryStub()
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

  test('Should call LoadSurveysRepository', async () => {
    const { sut,loadSurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})
