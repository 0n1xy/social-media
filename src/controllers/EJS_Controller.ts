import { Request, Response } from "express";

export const startChat = async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Render the EJS page and pass `userId` if it exists
  res.render("chat", { userId });
};
