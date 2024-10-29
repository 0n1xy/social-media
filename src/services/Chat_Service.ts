import { PubSub } from 'graphql-subscriptions';
import { ChatMessage } from '@/models/Chat_Schema'; // Assuming ChatMessage is a Mongoose model

const pubsub = new PubSub();
const MESSAGE_SENT = 'MESSAGE_SENT';

class ChatService {
  async sendMessage(roomId: string, senderId: string, message: string) {
    // Save the message to the database
    const chatMessage = new ChatMessage({ roomId, senderId, message, timestamp: new Date() });
    await chatMessage.save();

    // Publish the message to subscribers
    pubsub.publish(MESSAGE_SENT, { messageSent: chatMessage });

    return chatMessage;
  }

  async getChatHistory(roomId: string) {
    // Retrieve chat history from the database
    return await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
  }

  subscribeToMessages(roomId: string) {
    return pubsub.asyncIterator([MESSAGE_SENT]); // Subscribes to the MESSAGE_SENT event
  }
}

export default new ChatService();