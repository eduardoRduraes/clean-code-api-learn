import { Validation } from "../../../presentation/protocols/validation"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { makeSignUpValidation } from "./signup-validation"
import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValiadtorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValiadtorStub()
}


describe('SignValidation Factory', ()=>{
  test('Should call ValidatioComposite with all validations', ()=>{
    makeSignUpValidation()
    const validations: Validation[] = []

    for(const field of ['name','email','password', 'passwordConfirmation']){
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email',makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
