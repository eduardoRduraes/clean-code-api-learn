import { AccountModel } from '../models/account'

export type AddAccountModel = Omit<AccountModel, 'id'>

export type AddAccount = {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
