import express from "express";
import UserRouter from "@/routers/User_Router";
import PostRouter from "@/routers/Post_Router";

export const routers = (app: express.Router) => {
  app.use("/user", UserRouter);
  app.use("/post", PostRouter);
};
