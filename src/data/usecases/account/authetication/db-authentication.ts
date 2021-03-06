import { LoadAccountByEmailRepository,HashComparer,Encrypter,UpdateAccessTokenRepository,  } from "./db-authentication-protocols"
import {AuthenticationModel, Authentication} from '@/domain/usecases/authenticatoin'
export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ){}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)

    if(account){
      const isvalid = await this.hashComparer.compare(authentication.password, account.password)
      if(isvalid){
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}

