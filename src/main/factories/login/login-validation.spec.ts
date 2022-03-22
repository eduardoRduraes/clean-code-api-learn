import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { Validation } from "../../../presentation/protocols/validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { makeLoginValidation } from "./login-validation"

jest.mock('../../../presentation/helpers/validators/validation-composite')

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
