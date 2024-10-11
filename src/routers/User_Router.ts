import {
  createUser,
  deleteUserById,
  getallUserData,
  getUserById,
  updateUser,
} from "@/controllers/User_Controller";
import { sendLikeEvent } from "@/kafka/likeProducer";

import { Router } from "express";

const router = Router();

router.delete("/user/:id", deleteUserById);
router.post("/create", createUser);
router.get("/users", getallUserData);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUserById);
router.post("/like-post", async (req, res) => {
  const { userId, postId } = req.body;

  // Logic to handle the post like

  // Send the notification event
  await sendLikeEvent(userId, postId);

  res.send({ message: "Post liked" });
});

export default router;
