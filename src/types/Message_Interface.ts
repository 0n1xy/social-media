import { ObjectId } from "mongodb";

export interface IMessage {
    _id: ObjectId;
    sender_id?: ObjectId;
    receiver_id?: ObjectId;
    message_content: string;
    created_date: Date;
}