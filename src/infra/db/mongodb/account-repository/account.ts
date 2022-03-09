import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'

 export class AccountMongoRepository implements AddAccountRepository{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const {_id: id, name, email, password } = await accountCollection.findOne(result.insertedId)
    // Object.assign({}, accountWithoutId, { id: _id.toString() })
    return {id:id.toString(), name, email, password }
  }

}
