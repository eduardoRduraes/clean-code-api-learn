import { AccessDeniedError } from "../errors"
import { forbidden } from "../helpers/http/http-helper"
import { HttpRequest, HttpResponse } from "../protocols"
import { Middleware } from "../protocols/middleware"

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
    if(!httpRequest.headers){
      return forbidden(new AccessDeniedError())
    }
    return null
  }
}
