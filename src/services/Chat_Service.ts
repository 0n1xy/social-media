// src/services/ChatService.ts
import { ChatMessage } from "@/models/Chat_Schema";

class ChatService {
  async createMessage(
    senderUserId: string,
    receiveUserId: string,
    message: string,
    media: string[] = []
  ) {
    const newMessage = new ChatMessage({
      senderUserId,
      receiveUserId,
      message,
      media,
      timestamp: new Date(),
    });

    // Save message to database
    await newMessage.save();
    return newMessage;
  }

  async getRecentMessages(
    userId1: string,
    userId2: string,
    limit: number,
    lastTimestamp?: Date
  ) {
    const query = {
      $or: [
        { senderUserId: userId1, receiveUserId: userId2 },
        { senderUserId: userId2, receiveUserId: userId1 },
      ],
      ...(lastTimestamp && { timestamp: { $lt: lastTimestamp } }), // Fetch only older messages
    };

    return await ChatMessage.find(query)
      .sort({ timestamp: -1 }) // Sort from newest to oldest
      .limit(limit)
      .exec();
  }

  async getMessageById(messageId: string) {
    return await ChatMessage.findById(messageId);
  }

  async updateMessage(messageId: string, newContent: string) {
    return await ChatMessage.findByIdAndUpdate(
      messageId,
      { message: newContent },
      { new: true }
    );
  }

  async deleteMessageById(messageId: string) {
    return await ChatMessage.findByIdAndDelete(messageId);
  }
}

export default new ChatService();
