import express from "express";
import UserRouter from "@/routers/User_Router";

export const routers = (app: express.Router) => {
  app.use("/user", UserRouter);
};
