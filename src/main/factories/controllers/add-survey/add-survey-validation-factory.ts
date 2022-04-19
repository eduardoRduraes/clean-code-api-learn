import { Validation } from "../../../../validation/protocols/validation"
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validator'


export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []

    for(const field of ['question','answers']){
      validations.push(new RequiredFieldValidation(field))
    }
  return new ValidationComposite(validations)
}
