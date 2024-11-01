// src/controllers/ChatController.ts
import { Request, Response } from "express";
import ChatService from "@/services/Chat_Service";
import User from "@/models/UserModel";
import UploadFileService from "@/services/UploadFile_Service";

const uploadFileService = new UploadFileService();

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { senderUserId, receiveUserId, message, media } = req.body;

    if (!senderUserId || !receiveUserId) {
      return res
        .status(400)
        .json({ message: "Both sender and receiver IDs are required" });
    }

    const senderUser = await User.findById(senderUserId);
    const receiverUser = await User.findById(receiveUserId);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize mediaUrls as an empty array
    let mediaUrls: string[] = [];

    // Handle media if provided
    if (media) {
      // Handle both single and multiple files
      if (typeof media === "string" || Array.isArray(media)) {
        mediaUrls = await uploadFileService.uploadFiles(media);
      } else {
        return res.status(400).json({ message: "Invalid media format" });
      }
    }

    // Create the message with text, media, or both
    const newMessage = await ChatService.createMessage(
      senderUserId,
      receiveUserId,
      message || "", // Text message (optional)
      mediaUrls // Media URLs (optional)
    );

    return res.status(201).json({
      status: 201,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error: any) {
    console.error("Error creating message:", error);
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const getRecentMessages = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.query;
    const limit = parseInt(req.query.limit as string) || 20; // Define a reasonable limit
    const lastTimestamp = req.query.lastTimestamp
      ? new Date(req.query.lastTimestamp as string)
      : undefined;

    const messages = await ChatService.getRecentMessages(
      userId1 as string,
      userId2 as string,
      limit,
      lastTimestamp
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving messages", error });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const message = await ChatService.getMessageById(req.params.id);
    if (message) {
      return res.status(200).json({
        status: 200,
        data: message,
      });
    }
    res.status(404).json({ message: "Message not found" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving message", error });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const updatedMessage = await ChatService.updateMessage(
      req.params.id,
      req.body.message
    );
    if (updatedMessage) {
      res.status(200).json({
        message: "Message updated successfully",
        data: updatedMessage,
      });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update message", error });
  }
};

export const deleteMessageById = async (req: Request, res: Response) => {
  try {
    const deletedMessage = await ChatService.deleteMessageById(req.params.id);
    if (deletedMessage) {
      res.status(200).json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message", error });
  }
};
