import Comment from '@/models/CommentModel';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from "mongodb";
import { handleError } from "@/utils/errorHandler";

//GET Post
export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json(comments);
    } catch (error) {
        handleError(res, error, "Error fetching comments");
    }
}

export const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            return res.status(404).json({message: "Comment not existing!"})
        }
        res.status(200).json(comment);
    } catch (error) {
        handleError(res, error, "Error fetching comment");
    }
}

export const getCommentFromUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const comments = await Comment.find({user_id : userId});
        if(!comments.length) {
            return res.status(404).json({message: "User has no comments yet!"})
        }
        res.status(200).json(comments);
    } catch (error) {
        handleError(res, error, "Error fetching comments");
    }
}

export const getCommentFromPost = async (req: Request, res: Response, next: NextFunction) => {
    const post_id = req.params.post_id;

    if (!post_id) {
        return res.status(400).json({ message: "Post ID is required." });
    }

    try {
        const comments = await Comment.find({post_id : post_id});
        if(!comments.length) {
            return res.status(404).json({message: "Post has no comments yet!"})
        }
        res.status(200).json(comments);
    } catch (error) {
        handleError(res, error, "Error fetching comments");
    }
}

//CREATE Post
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.user_id;
    const postId = req.params.post_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    if (!postId) {
        return res.status(400).json({ message: "Post ID is required." });
    }

    const { comment_text } = req.body;
    if (!comment_text) {
        return res.status(400).json({ message: "Comment Text are required." });
    }

    const comment = new Comment({
        _id: new ObjectId(),
        user_id: userId,
        post_id: postId,
        comment_text: comment_text,
    });

    await comment.save();
    res.status(201).json({ message: "Comment created!", comment });
  } catch (error) {
    handleError(res, error, "Error when creating comment!");
  }
}

//UPDATE Post
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const existingComment = await Comment.findById(req.params.id);
        if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
        }

        const { comment_text } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                comment_text: comment_text,
            },
            { new: true }
        );

        if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment updated!", updatedComment });
    } catch (error) {
        handleError(res, error, "Error updating comment!");
    };
}

//DELETE Post
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment)
            return res.status(404).json({ message: "Comment not found"})

        res.status(200).json({ message: "Comment deleted!"});
    } catch(error) {
        handleError(res, error, "Error occur when deleting comment!");
    }
}

