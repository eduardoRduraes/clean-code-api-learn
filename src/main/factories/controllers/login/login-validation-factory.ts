import { EmailValidatorAdapter } from "../../../../infra/validators/email-validator-adapter"
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validator'
import { Validation } from "../../../../validation/protocols/validation"


export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []

    for(const field of ['email','password']){
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email',new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}