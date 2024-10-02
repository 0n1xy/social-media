import { IFollow } from './../types/Follow_Interface';
import { Schema, model } from "mongoose";

export const followSchemaFields = {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    follower_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    followed_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    created_date: { type: Date, default: Date.now, required: true },
};

const followSchema = new Schema<IFollow>(followSchemaFields);

const Follow = model<IFollow>("Follow", followSchema);

export default Follow;