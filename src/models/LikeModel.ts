import { ILike } from "./../types/Like_Interface";
import { Schema, model } from "mongoose";

export const likeSchemaFields = {
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_date: { type: Date, default: Date.now, required: true },
};

const likeSchema = new Schema<ILike>(likeSchemaFields);

const Like = model<ILike>("Like", likeSchema);

export default Like;
