import {
  createPost,
  deletePost,
  getAllPost,
  getPostByUserId,
  updatePost,
} from "@/controllers/Post_Controller";
import { Router } from "express";

const router = Router();

router.get("/posts", getAllPost);
router.get("/post/:id", getAllPost);
router.get("/posts/:user_id", getPostByUserId);
router.post("/post/", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

export default router;
