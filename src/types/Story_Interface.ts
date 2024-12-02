import { ObjectId } from "mongodb";

export interface IStory {
  _id: ObjectId;
  user_id?: ObjectId;
  text: string;
  media?: string[];
  created_date: Date;
}
