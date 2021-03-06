import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveyRepository, SurveyModel } from './db-load-surveys-protocols'
import mockDate from 'mockdate'


describe('DbLoadSurveys', () => {

  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  type SutTypes = {
    sut: DbLoadSurveys,
    loadSurveyRepositoryStub: LoadSurveyRepository
  }

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

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut,loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error())))
    const promise = sut.load()
    expect(promise).rejects.toThrow()
  })
})
