import mongoose, { Schema, Document } from 'mongoose';

const ChatMessageSchema: Schema = new Schema({
  roomId: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
