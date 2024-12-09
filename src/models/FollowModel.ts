import { IFollow } from "./../types/Follow_Interface";
import { Schema, model } from "mongoose";

export const followSchemaFields = {
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  //ID OF USER
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  //ID OF USER WHO I WANT TO FOLLOW
  receiver_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"], // For follow requests
    default: "pending",
  },
  created_date: { type: Date, default: Date.now, required: true },
};

const followSchema = new Schema<IFollow>(followSchemaFields);

const Follow = model<IFollow>("Follow", followSchema);

export default Follow;
