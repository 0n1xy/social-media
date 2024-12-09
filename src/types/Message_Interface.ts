import { ObjectId } from "mongoose";

export interface IMessage {
  _id: ObjectId;
  sender_id?: ObjectId;
  receiver_id?: ObjectId;
  message_content: string;
  created_date: Date;
}
