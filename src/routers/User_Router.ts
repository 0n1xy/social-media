import {
  createUser,
  deleteUserById,
  getallUserData,
  getUserById,
  updateUser,
} from "@/controllers/User_Controller";
import { Router } from "express";

const router = Router();

router.delete("/user/:id", deleteUserById);
router.post("/create", createUser);
router.get("/users", getallUserData);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUserById);
export default router;
