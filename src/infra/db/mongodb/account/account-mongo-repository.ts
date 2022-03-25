import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { ObjectId } from 'mongodb';

 export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository{

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(await accountCollection.findOne(result.insertedId))
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({email: email})
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void>{
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      {
        _id: new ObjectId(id)
      }
      ,{
        $set:{
          accessToken: token
        }
      }).then(res=>console.log(res))
  }
}
