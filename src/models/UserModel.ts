import { IUser } from "../types/User_Interface";
import { Schema, model } from "mongoose";


export const userSchemaFields = {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    sex: { type : String},
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { type: Date, required: true },
    profile_picture: { type: String },
    biography: { type: String },
    created_date: { type: Date, default: Date.now(), required: true },
    updated_date: { type: Date, default: Date.now(), required: true },
};
const userSchema = new Schema<IUser>(userSchemaFields);
userSchema.pre('save', function(next) {
    this.updated_date = new Date();
    next();
});

const User = model<IUser>("User", userSchema);

export default User;
