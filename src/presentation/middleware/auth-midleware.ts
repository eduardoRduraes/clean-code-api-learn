import { AccessDeniedError } from "@/presentation/errors"
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper"
import { HttpResponse } from "@/presentation/protocols"
import { HttpRequest, LoadAccountByToken, Middleware } from './auth-midleware-protocolls'

export class AuthMiddleware implements Middleware {

  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
    ){}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
    try {
      const accessToken = await httpRequest.headers?.['x-access-token']

      if(accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if(account) {
          return ok({accountId: account.id})
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
