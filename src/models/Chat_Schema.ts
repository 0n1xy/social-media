import mongoose, { Schema, Document } from "mongoose";

const ChatMessageSchema: Schema = new Schema({
  senderUserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  receiveUserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  message: { type: String },
  media: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now },
});

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
