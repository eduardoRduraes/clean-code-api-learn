import { EmailInUserError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SignUpController } from './signup-controller'
import { AccountModel, AddAccount, AddAccountModel, Authentication, AuthenticationModel, HttpRequest, Validation } from './signup-controller-protocols'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body:{
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  }
})

const makeFakeAccount = (): AccountModel =>({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication =>{
  class AuthenticationStub implements Authentication {
    async auth (authenticationModel: AuthenticationModel): Promise<string>{
      return new Promise(resolve =>resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

// const makeEmailValidatorError = (): EmailValidator => {
//   class EmailValiadtorStub implements EmailValidator {
//     isValid (email: string): boolean {
//       throw new Error()
//     }
//   }
//   return new EmailValiadtorStub()
// }

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub,validationStub,authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  // test('Should return 400 if no name is provided', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       email: 'any_email@mail.com',
  //       password: 'any_password',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  // })

  // test('Should return 400 if no email is provided', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       password: 'any_password',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  // })

  // test('Should return 400 if no password is provided', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       password: 'any_password',
  //       passwordConfirmation: 'invalid_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  // })

  // test('Should return 400 if no password confirmation is provided', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       password: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  // })
  //
  // test('Should return 400 if no password confirmation fails', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@mail.com',
  //       password: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  // })

  // test('Should return 400 if an invalid email is provided', async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'invalid_email@mail.com',
  //       password: 'any_password',
  //       passwordConfirmation: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  // })


  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, rejects) => rejects(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 403 if addAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve=>resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUserError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({accessToken: 'any_token'}))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest )
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut,validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authetication with correct values', async ()=>{
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email:'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async ()=>{
    const { sut,authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve,reject)=> reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
