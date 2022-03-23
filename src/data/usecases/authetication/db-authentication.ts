import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { Authentication,AuthenticationModel } from "../../../domain/usecases/authenticatoin";

export class DBAuthentication implements Authentication{
  private readonly loadAccountByEmailRepository : LoadAccountByEmailRepository
  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository){
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    return account.email
  }
}

