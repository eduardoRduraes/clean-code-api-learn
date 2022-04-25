
import { Validation } from '../../../../../presentation/protocols'
import { EmailValidator } from '../../../../../presentation/protocols/email-validator'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validator'
import { makeLoginValidation } from "./login-validation-factory"

jest.mock('../../../../../validation/validator/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValiadtorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValiadtorStub()
}

describe('LoginValidation Factory', ()=>{
  test('Should call ValidatioComposite with all validations', ()=>{
    makeLoginValidation()
    const validations: Validation[] = []

    for(const field of ['email','password']){
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email',makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
