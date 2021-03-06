import { EmailInUserError } from '@/presentation/errors'
import { AddAccount } from '@/domain/usecases/add-account'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {

  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if(error){
        return badRequest(error)
      }


      const { name, email, password, role } = httpRequest.body


      const account = await this.addAccount.add({
        name,
        email,
        password,
        role
      })

      if(!account){
        return forbidden(new EmailInUserError())
      }

      const accessToken = await this.authentication.auth({email, password})
      return ok({accessToken})
    } catch (error) {
      return serverError(error)
    }
  }
}
