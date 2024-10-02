import { ObjectId } from "mongodb";

export interface ILike {
    _id: ObjectId;
    post_id?: ObjectId;
    user_id?: ObjectId;
    created_date: Date;
}