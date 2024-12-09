import {
  createUser,
  deleteUserById,
  followUser,
  getallUserData,
  getFollowRequest,
  getUserById,
  newFeed,
  updateUser,
} from "@/controllers/User_Controller";

import { Router } from "express";
import { verifyToken } from "@/middlewares/verifyToken";

const router = Router();

router.post("/create", createUser);
router.post("/follow", followUser);
router.post("/request", getFollowRequest);
router.post("/newFeed/", newFeed);
router.get("/users", verifyToken, getallUserData);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUserById);
router.delete("/user/:id", deleteUserById);

export default router;
