import {
  createPost,
  deletePost,
  getAllPost,
  getPostByUserId,
  updatePost,
} from "@/controllers/Post_Controller";
import { Router } from "express";

const router = Router();

router.post("/create", createPost);
router.get("/posts", getAllPost);
router.get("/post/:id", getPostByUserId);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

export default router;
