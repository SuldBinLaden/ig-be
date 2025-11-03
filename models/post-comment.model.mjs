import mongoose from "mongoose";
import { nanoid } from "nanoid";

const PostCommentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: nanoid() },
    text: { type: String },

    post: { type: String, ref: "Post" },
    createdBy: { type: String, ref: "User" },

    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const PostCommentModel = mongoose.model("PostComment", PostCommentSchema);
