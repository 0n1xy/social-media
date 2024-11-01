import {
  createUser,
  deleteUserById,
  getallUserData,
  getUserById,
  updateUser,
} from "@/controllers/User_Controller";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verifyToken";

const router = Router();

router.delete("/user/:id", deleteUserById);
router.post("/create", createUser);
router.get("/users", verifyToken, getallUserData);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUserById);
export default router;
