

import { MissingParamError } from "../../../errors"
import { badRequest, serverError, unauthorized,ok } from "../../../helpers/http/http-helper"
import { LoginController } from "./login-controller"
import { Authentication, AuthenticationModel, HttpRequest, Validation } from "./login-controller-protocols"


const makeFakeRequest = ():HttpRequest =>({
  body:{
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeAuthentication = (): Authentication =>{
  class AuthenticationStub implements Authentication {
    async auth (authenticationModel: AuthenticationModel): Promise<string>{
      return new Promise(resolve =>resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', ()=>{
  // test('Should return 400 if no email is provided', async ()=>{
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body:{
  //       password: 'any_password'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  // })

  // test('Should return 400 if no password is provided', async ()=>{
  //   const { sut } = makeSut()

  //   const httpRequest = {
  //     body:{
  //       email: 'any_email@mail.com'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  // })

  // test('Should return 400 if an invalid email is provided', async ()=>{
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  // })

  // test('Should call EmailValidator with correct email', async ()=>{
  //   const { sut,emailValidatorStub } = makeSut()
  //   const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

  //   await sut.handle(makeFakeRequest())
  //   expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  // })

  // test('Should return 500 if EmailValidator throws', async ()=>{
  //   const { sut,emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{
  //     throw new Error()
  //   })

  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(serverError(new Error()))
  // })

  test('Should return 500 if Authentication throws', async ()=>{
    const { sut,authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve,reject)=> reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
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

  test('Should return 401 if invalid crendetials are provider', async ()=>{
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve=>resolve(null)))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 if invalid crendetials are provider', async ()=>{
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({accessToken: 'any_token'}))
  })


  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut,validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})