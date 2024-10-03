import { IMessage } from './../types/Message_Interface';
import { Schema, model } from "mongoose";

export const messageSchemaFields = {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    sender_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    receiver_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    message_content: {type: String, required: true},
    created_date: { type: Date, default: Date.now, required: true },
};

const messageSchema = new Schema<IMessage>(messageSchemaFields);

const Message = model<(IMessage)>("Message", messageSchema);

export default Message;