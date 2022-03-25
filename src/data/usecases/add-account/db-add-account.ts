import { AddAccount,AccountModel,AddAccountModel, Hasher } from './db-add-account-protocols'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
export class DBAddAccount implements AddAccount{
  constructor(private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({},accountData,{password: hashedPassword}))
    return account
  }
}
