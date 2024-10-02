import { ObjectId } from "mongodb";

export interface INotification {
    _id: ObjectId;
    user_id?: ObjectId;
    notification_text: string;
    is_read: boolean;
    created_date: Date;
}