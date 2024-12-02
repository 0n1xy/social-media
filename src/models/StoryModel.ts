import mongoose, { Schema, Document } from "mongoose";

const ChatMessageSchema: Schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, default: ""},
  media: { type: [String], default: [] },
  created_date: { type: Date, default: Date.now, required: true }
});