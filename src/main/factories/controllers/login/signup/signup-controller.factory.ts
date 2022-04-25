
import { makeDbAddAccount } from "../../../../../main/factories/usecases/account/add-account/db-add-account-factory";
import { SignUpController } from "../../../../../presentation/controllers/login/signup/signup-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from '../../../decorators/log-controller.decorator-factory'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'


export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(),makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}