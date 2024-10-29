import Like from "@/models/LikeModel";
import PaginationService from "@/services/Pagination_Service";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

const paginationService = new PaginationService();

export const likePost = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const saveData = new Like({
      _id: new ObjectId(),
      postId: data.postId,
      userId: data.userId,
    });

    await saveData.save();

    res.status(201).json({ message: "Success", saveData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getLikebyUserId = async (req: Request, res: Response) => {
  try {
    const p = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const data = await Like.find();

    const paginationResult = await paginationService.paginateArray(
      data,
      p,
      limit
    );

    return res.status(200).json({
      data: paginationResult.data,
      totalDocuments: paginationResult.totalDocuments,
      totalPages: paginationResult.totalPages,
      currentPage: paginationResult.currentPage,
      limit: paginationResult.limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const unLike = async (req: Request, res: Response) => {
  try {
    const updateData = await Post.findByIdAndUpdate(req.params.id, req.body);
    if (updateData) {
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(500).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
