import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ProfileSchema = new mongoose.Schema(
  {
    _id: { type: String, default: nanoid() },
    imageUrl: { type: String },
  }
);

ProfileSchema.virtual("comments", {
  ref: "PostComment",
  localField: "_id",
  foreignField: "post",
});

ProfileSchema.virtual("likes", {
  ref: "PostLike",
  localField: "_id",
  foreignField: "post",
});

ProfileSchema.set("toObject", { virtuals: true });
ProfileSchema.set("toJSON", { virtuals: true });

export const ProfileModel = mongoose.model("Profile", ProfileSchema);