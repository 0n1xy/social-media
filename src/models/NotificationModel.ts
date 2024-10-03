import { INotification } from "@/types/Notification_Interface";
import { Schema, model } from "mongoose";

export const notificationSchemaFields = {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    notification_text: {type: String, required: true},
    is_read: { type:Boolean, default: false },
    created_date: { type: Date, default: Date.now, required: true },
};

const notificationSchema = new Schema<INotification>(notificationSchemaFields);

const Notification = model<(INotification)>("Notification", notificationSchema);

export default Notification;