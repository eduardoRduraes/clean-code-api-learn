import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import {serverError} from '../../../presentation/helpers/http/http-helper'

describe('DbAddSurvey UseCase', () => {

  const makefakeSurvey = (): AddSurveyModel =>({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  })

  interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub : AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
      sut,
      addSurveyRepositoryStub
    }
  }

  const makeAddSurveyRepositoryStub = (): AddSurveyRepository =>{
    class AddSurveyRepository implements AddSurveyRepository {
      async add(surveyData: AddSurveyModel): Promise<void>{
        return new Promise(resolve=>resolve())
      }
    }
    return new AddSurveyRepository()
  }

  test('Should Call AddSurveyRepository with correct values', async () => {
    const { sut,addSurveyRepositoryStub } = makeSut()
    const surveyData = makefakeSurvey()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(makefakeSurvey())
  })
})
