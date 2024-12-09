import { ObjectId } from "mongoose";

export interface IComment {
  _id: ObjectId;
  post_id?: ObjectId;
  user_id?: ObjectId;
  comment_text: string;
  created_date: Date;
  updated_date: Date;
}
