interface IChatMessage extends Document {
  senderUserId: string;
  receiveUserId: string;
  message?: string;
  media?: string[];
  timestamp: Date;
}
