import express from "express";
import UserRouter from "@/routers/User_Router";
import PostRouter from "@/routers/Post_Router";
import OAuthRouter from "@/routers/OAuth_Router";
import ChatRouter from "@/routers/Chat_Router";
import EJSRouter from "@/routers/EJS_Router";
import { Server } from "socket.io";

export const routers = (app: express.Router) => {
  app.use("/user", UserRouter);
  app.use("/post", PostRouter);
  app.use("/auth", OAuthRouter);
  app.use("/", ChatRouter);
  app.use("/", EJSRouter);
};
