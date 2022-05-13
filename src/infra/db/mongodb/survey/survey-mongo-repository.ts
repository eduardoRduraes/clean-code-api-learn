
import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository";
import { LoadSurveyRepository, SurveyModel } from "@/data/usecases/survey/load-surveys/db-load-surveys-protocols";
import { AddSurveyModel } from "@/domain/usecases/add-survey";
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id";
import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";


export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyById {

  async loadAll(): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveysCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadById (id: string): Promise<SurveyModel>{
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({_id: new ObjectId(id)})
    return MongoHelper.map(survey)
  }
}
