import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')

    const surveyResult = await surveyResultCollection.findOneAndUpdate({
        "accountId": new ObjectId(data.accountId),
        "suveryId": new ObjectId(data.surveyId),
    },{
      $set : {
        answer: data.answer,
        date: data.date
      }
    },{
      upsert: true,
      returnDocument: 'after'
    })

    return surveyResult.value && MongoHelper.map(surveyResult.value)
  }
}

