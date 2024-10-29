import { ObjectId } from "mongodb";

export interface IPost {
  _id: ObjectId;
  user_id?: ObjectId;
  post_title: string;
  content: string;
  media: [string];
  created_date: Date;
  updated_date: Date;
}
