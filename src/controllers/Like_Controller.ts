import Like from "@/models/LikeModel";
import { Request, Response, NextFunction } from 'express';
import { handleError } from "@/utils/errorHandler";
import { ObjectId } from "mongodb";

//GET Post
export const getAllLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const likes = await Like.find({});
        res.status(200).json(likes);
    } catch (error) {
        handleError(res, error, "Error fetching likes");
    }
}

export const getLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const like = await Like.findById(req.params.id);
        if(!like) {
            return res.status(404).json({message: "Like not existing!"})
        }
        res.status(200).json(like);
    } catch (error) {
        handleError(res, error, "Error fetching Like");
    }
}

export const getLikeFromUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const likes = await Like.find({user_id : userId});
        if(!likes.length) {
            return res.status(404).json({message: "User hasn't like any post yet!"})
        }
        res.status(200).json(likes);
    } catch (error) {
        handleError(res, error, "Error fetching likes");
    }
}

//CREATE Post
export const createLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.user_id;
    const postId = req.params.post_id;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    if (!postId) {
        return res.status(400).json({ message: "Post ID is required." });
    }

    const like = new Like({
        _id: new ObjectId(),
        user_id: userId,
        post_id: postId,
    });

    await like.save();
    res.status(201).json({ message: "Post liked!", like });
  } catch (error) {
    handleError(res, error, "Error when like a post!");
  }
}

//DELETE Post
export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const like = await Like.findByIdAndDelete(req.params.id);
        if (!like)
            return res.status(404).json({ message: "Like not found"})

        res.status(200).json({ message: "Like removed!"});
    } catch(error) {
        handleError(res, error, "Error occur when unlike a post!");
    }
}
