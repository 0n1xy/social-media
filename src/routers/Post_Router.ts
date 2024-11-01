import { 
    getAllPost,
    getPost,
    getPostFromUser,
    createPost,
    updatePost,
    deletePost
} from '@/controllers/Post_Controller';
import { Router } from 'express';

const router = Router();

router.get("/posts", getAllPost);
router.get("/post/:id", getPost);
router.get("/posts/:user_id", getPostFromUser);
router.post("/post/", createPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);
export default router;
