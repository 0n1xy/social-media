interface IChatMessage extends Document {
    roomId: string;
    senderId: string;
    message: string;
    timestamp: Date;
  }