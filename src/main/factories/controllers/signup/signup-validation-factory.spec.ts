import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { Validation } from '../../../../validation/protocols/validation'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validator'
import { makeSignUpValidation } from "./signup-validation-factory"

jest.mock('../../../../validation/validator/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValiadtorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValiadtorStub()
}


describe('SignValidation Factory', ()=>{
  test('Should call ValidatioComposite with all validations', () => {
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
