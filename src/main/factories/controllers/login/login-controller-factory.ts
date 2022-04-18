import { Controller } from "../../../../validation/protocols";
import { LoginController } from "../../../../presentation/controllers/login/login-controller";

import { makeLogControllerDecorator } from "../../decorators/log-controller.decorator-factory";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";


export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
