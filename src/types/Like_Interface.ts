import { ObjectId } from "mongoose";

export interface ILike {
  _id: ObjectId;
  postId?: ObjectId;
  userId?: ObjectId;
  created_date: Date;
}
