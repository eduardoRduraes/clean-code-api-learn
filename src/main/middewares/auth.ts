import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/middlewares/add-survey/auth-middleware-factory";

export const auth =  adaptMiddleware(makeAuthMiddleware())
