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
  sex: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: false },
  email: { type: String, required: true },
  birthday: { type: Date, required: false },
  profile_picture: { type: String },
  biography: { type: String },
  created_date: { type: Date, default: Date.now(), required: false },
  updated_date: { type: Date, default: Date.now(), required: false },
};
const userSchema = new Schema<IUser>(userSchemaFields);

const User = model<IUser>("User", userSchema);

export default User;
