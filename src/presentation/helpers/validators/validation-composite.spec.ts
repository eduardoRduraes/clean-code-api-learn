import { MissingParamError } from "../../../presentation/errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
  validationStub: Validation
  sut: ValidationComposite
}

const makeValidationStub = () =>{
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = ():SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', ()=>{
  test('Should return an error if any validation fails', ()=>{


    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({field: 'any_value'})
    expect(error).toEqual(new MissingParamError('field'))
  })
})
