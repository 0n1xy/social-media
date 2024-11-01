import {
  POST_LIMIT_PAGINATION,
  POST_PAGE_PAGINATION,
} from "@/constant/Post_Constant";
import Post from "@/models/PostModel";
import PaginationService from "@/services/Pagination_Service";
import UploadFileService from "@/services/UploadFile_Service";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

const paginationService = new PaginationService();
const uploadFileService = new UploadFileService();

export const createPost = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { media } = req.body;

    let mediaUrls: string[] = [];

    // Check if media is provided
    if (media) {
      // Handle both single and multiple files
      if (typeof media === "string" || Array.isArray(media)) {
        mediaUrls = await uploadFileService.uploadFiles(media);
      } else {
        return res.status(400).json({ message: "Invalid media format" });
      }
    }

    // Create a new post object with or without media
    const saveData = new Post({
      _id: new ObjectId(),
      user_id: data.user_id,
      post_title: data.post_title,
      media: mediaUrls, // This will be an empty array if no media
      content: data.content,
    });

    await saveData.save();

    res.status(201).json({ message: "Success", saveData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || POST_PAGE_PAGINATION;
    const limit = parseInt(req.query.limit as string) || POST_LIMIT_PAGINATION;
    const data = await Post.find();

    const paginationResult = await paginationService.paginateArray(
      data,
      page,
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

export const getPostByUserId = async (req: Request, res: Response) => {
  try {
    const data = await Post.find({ user_id: req.params.id });
    res.status(200).json({ message: " Success", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
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

export const deletePost = async (req: Request, res: Response) => {
  try {
    const deleteData = await Post.findByIdAndDelete(req.params.id);
    if (deleteData) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(500).json({ message: "Post not found" });
    }
  } catch (error) {}
};
