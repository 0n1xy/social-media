import { ObjectId } from "mongodb";

export interface IUser {
    _id: ObjectId;
    username: string;
    password: string;
    sex : string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    birthday: Date;
    profile_picture: string;
    biography: string;
    created_date: Date;
    updated_date: Date;
}