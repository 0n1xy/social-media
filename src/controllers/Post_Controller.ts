import Like from "@/models/LikeModel";
import Post from "@/models/PostModel";
import Comment from "@/models/CommentModel";
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from "mongodb";
import { handleError } from "@/utils/errorHandler";

//GET Post
export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({});
        res.status(200).json(posts);
    } catch (error) {
        handleError(res, error, "Error fetching posts");
    }
}

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message: "Post not existing!"})
        }
        
        const likes = await Like.countDocuments({ post_id: post?._id })

        res.status(200).json({ post, likes });
    } catch (error) {
        handleError(res, error, "Error fetching post");
    }
}

export const getPostFromUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const posts = await Post.find({user_id : userId});
        if(!posts.length) {
            return res.status(404).json({message: "User has no post yet!"})
        }
        res.status(200).json(posts);
    } catch (error) {
        handleError(res, error, "Error fetching post");
    }
}

//CREATE Post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const { post_title, content } = req.body;
    if (!post_title || !content) {
        return res.status(400).json({ message: "Post title and content are required." });
    }

    const post = new Post({
        _id: new ObjectId(),
        user_id: userId,
        post_title: post_title,
        content: content,
    });

    await post.save();
    res.status(201).json({ message: "Post created!", post });
  } catch (error) {
    handleError(res, error, "Error when creating post!");
  }
}

//UPDATE Post
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingPost = await Post.findById(req.params.id);
        if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
        }

        // if (existingPost.user_id?.toString() != req.user.id) {
        //     return res.status(403).json({ message: "Access denied. You do not own this post." });
        // }

        const { post_title, content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                post_title: post_title,
                content: content,
            },
            { new: true }
        );

        if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated!", updatedPost });
    } catch (error) {
        handleError(res, error, "Error updating post!");
    };
}

//DELETE Post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post)
            return res.status(404).json({ message: "Post not found"})

        res.status(200).json({ message: "Post deleted!"});
    } catch(error) {
        handleError(res, error, "Error occur when deleting post!");
    }
}
