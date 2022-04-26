import { AddSurveyModel, AddSurveyRepository } from "@/data/usecases/add-survey/db-add-survey-protocols";
import { LoadSurveyRepository, SurveyModel } from "@/data/usecases/load-surveys/db-load-surveys-protocols";
import { MongoHelper } from "../helpers/mongo-helper";


export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {

  constructor(){}

  async loadAll(): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveysCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
