import User from "@/models/UserModel";
import { Request, Response } from "express";
import UserService from "@/services/User_Service";
import PaginationService from "@/services/Pagination_Service";
import {
  USER_LIMIT_PAGINATION,
  USER_PAGE_PAGINATION,
} from "@/constant/User_Constant";

const userService = new UserService();
const paginationService = new PaginationService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const response = await userService.signUpMethod(req.body);

    if (response) {
      return res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: response,
      });
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const getallUserData = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || USER_PAGE_PAGINATION;
    const limit = parseInt(req.query.limit as string) || USER_LIMIT_PAGINATION;
    const user = await User.find();
    // Call the pagination service with User model
    const paginationResult = await paginationService.paginateArray(
      user,
      page,
      limit
    );

    return res.status(200).json({
      status: 200,
      data: paginationResult.data,
      totalDocuments: paginationResult.totalDocuments,
      totalPages: paginationResult.totalPages,
      currentPage: paginationResult.currentPage,
      limit: paginationResult.limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    if (userData) {
      return res.status(200).json({
        status: 200,
        data: userData,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Fail to find user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
    } else {
      res.status(500).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    console.log("Deleting User with ID:", req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(500).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};
