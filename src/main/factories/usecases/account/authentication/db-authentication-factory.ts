import env from "@/main/config/env"
import { Authentication } from "@/domain/usecases/authenticatoin"
import { BcryptAdapter } from "@/infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import { DBAuthentication } from "@/data/usecases/account/authetication/db-authentication"



export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DBAuthentication(accountMongoRepository,bcryptAdapter,jwtAdapter, accountMongoRepository)

}
