import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResult {
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

