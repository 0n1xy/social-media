import { ObjectId } from "mongoose";

export interface IFollow {
  _id: ObjectId;
  follower_id?: ObjectId;
  followed_id?: ObjectId;
  created_date: Date;
}
