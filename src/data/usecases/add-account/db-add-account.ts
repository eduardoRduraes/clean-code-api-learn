import { AddAccount,AccountModel,AddAccountModel, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
export class DBAddAccount implements AddAccount{
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if(!account){
      const hashedPassword = await this.hasher.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add(Object.assign({},accountData,{password: hashedPassword}))
      return newAccount
    }
      return null
  }
}
