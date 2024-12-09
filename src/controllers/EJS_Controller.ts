import { Request, Response } from "express";

export const startChat = async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Render the EJS page and pass `userId` if it exists
  res.render("chat", { userId });
};

export const notification = async (req: Request, res: Response) => {
  // const { userId } = req.query;
  res.render("notification");
};

export const home = async (req: Request, res: Response) => {
  const posts = [
    {
      title: "My First Post",
      content: "This is the content of my first post!",
      author: "John Doe",
      date: "2024-11-21",
    },
    {
      title: "Hello World",
      content: "Welcome to my blog!",
      author: "Jane Smith",
      date: "2024-11-20",
    },
  ];

  const user = {
    username: "Ashley24",
  };

  res.render("home", { user, posts });
};
