import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, Validation } from "./add-survey-controller-protocols";
import { badRequest } from '../../../helpers/http/http-helper'

describe('AddSurvey Controller', () => {
  interface SutTypes {
    sut: AddSurveyController
    validatationStub: Validation
  }

  const makeSut = (): SutTypes => {
    const validatationStub = makeValidationStub()
    const sut = new AddSurveyController(validatationStub)
    return {
      sut,
      validatationStub
    }
  }

  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return null
      }
    }
    return new ValidationStub()
  }

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image:'any_image',
        answer: 'any_answer'
      }]
    }
  })

  test('Should call Validation with correct values', async () => {
    const {sut, validatationStub} = makeSut()
    const validateSpy = jest.spyOn(validatationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const {sut, validatationStub} = makeSut()
    jest.spyOn(validatationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
