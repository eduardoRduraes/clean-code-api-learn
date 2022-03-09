import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'

 export class AccountMongoRepository implements AddAccountRepository{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)
    const {_id, ...accountWithoutId } = account
    const { id, name, email, password }  = Object.assign({}, accountWithoutId, { id: _id.toString() })
    return {id,name,email,password}
  }

}
