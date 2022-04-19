
import { Validation } from '../../../../validation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validator'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validator/validation-composite')

describe('AddSurveyValidation Factory', ()=>{
  test('Should call ValidatioComposite with all validations', ()=>{
    makeAddSurveyValidation()
    const validations: Validation[] = []

    for(const field of ['question','answers']){
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
