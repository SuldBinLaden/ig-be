import express from "express";
import { UserModel } from "../models/user.model.mjs";
import { UserFollowModel } from "../models/user-follow.model.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { nanoid } from "nanoid";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UserModel.find().select("_id username fullname createdAt");
  return res.status(200).send(users);
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).send({ message: "Username must be present" });
  }
  const user = await UserModel.findOne({ username: username }).select("_id username fullname createdAt").populate("followers followings");
  if (!user) {
    return res.status(404).send({ message: `User with ${username} not found!` });
  }
  const followersCount = await UserFollowModel.countDocuments({ user: String(user._id) });
  const followingCount = await UserFollowModel.countDocuments({ createdBy: String(user._id) });

  res.json({
    username: user.username,
    email: user.email,
    followersCount,
    followingCount,
  });
  return res.status(200).send(user);
});

router.post("/:username/follow", authMiddleware, async (req, res) => {
  // WHOM
  const username = req.params.username;

  const user = await UserModel.findOne({ username: username });
  if (!user) {
    return res.status(404).send({ message: "User not found!" });
  }

  const existingFollow = await UserFollowModel.findOne({ user: user._id, createdBy: req.user._id });

  if (!existingFollow) {
    await UserFollowModel.create({
      _id: nanoid(),
      user: String(user._id),
      createdBy: String(req.user._id),
    });

  }else {
    await UserFollowModel.findByIdAndDelete(existingFollow._id);
  }

  const followersCount = await UserFollowModel.countDocuments({ user: user._id });
  const followingCount = await UserFollowModel.countDocuments({ createdBy: req.user._id });

  return res.status(200).send({
    message: existingFollow
      ? "Амжилттай фоллов буцаалаа"
      : "Амжилттай фоллов хийлээ",
    isFollowing: !existingFollow,
    followersCount,
    followingCount,
  });

});



router.get("/:username/stats", authMiddleware, async (req, res) => {
  const username = req.params.username;
  const user = await UserModel.findOne({ username });
  if (!user) return res.status(404).send({ message: "User not found" });

  const followersCount = await UserFollowModel.countDocuments({ user: user._id });
  const followingCount = await UserFollowModel.countDocuments({ createdBy: user._id });
  const isFollowing = !!(await UserFollowModel.findOne({
    user: user._id,
    createdBy: req.user._id,
  }));

  return res.status(200).send({
    followersCount,
    followingCount,
    isFollowing,
  });
});

export default router;