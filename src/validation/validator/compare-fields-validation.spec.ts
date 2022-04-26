import { InvalidParamError } from "@/presentation/errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

const makeFakeRequest = {
  field: 'any_value',
  fieldToCompare: 'wrong_value'
}

describe('CompareFields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const  sut  = makeSut()
    const error = sut.validate(makeFakeRequest)
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
