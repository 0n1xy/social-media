// src/routes/chatRoutes.ts
import { Router } from "express";
import {
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessageById,
  getRecentMessages,
} from "@/controllers/Chat_Controller";
import { Server } from "socket.io";

const router = Router();

router.post("/messages", createMessage);
router.get("/messages", getRecentMessages);
router.get("/messages/:id", getMessageById);
router.put("/messages/:id", updateMessage);
router.delete("/messages/:id", deleteMessageById);

export default router;
