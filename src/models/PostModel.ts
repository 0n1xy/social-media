import { IPost } from "@/types/Post_Interface";
import User from "@/models/UserModel";
import { Schema, model } from "mongoose";

export const postSchemaFields = {
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_title: { type: String, required: true },
  content: { type: String },
  media: { type: [String] },
  created_date: { type: Date, default: Date.now, required: true },
  updated_date: { type: Date, default: Date.now, required: true },
};

const postSchema = new Schema<IPost>(postSchemaFields);

const Post = model<IPost>("Post", postSchema);

export default Post;
