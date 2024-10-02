import User from '@/models/UserModel';
import { Schema, model } from "mongoose";
import { IComment } from "@/types/Comment_Interface";

export const commentSchemaFields = {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    post_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true,
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    comment_text: { type: String, required: true },
    created_date: { type: Date, default: Date.now, required: true },
    updated_date: { type: Date, default: Date.now, required: true },
};

const commentSchema = new Schema<IComment>(commentSchemaFields);
commentSchema.pre('save', function(next) {
    this.updated_date = new Date();
    next();
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;