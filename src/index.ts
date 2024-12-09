import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import ConnectDB from "@/services/MongoDB_Service";
import { connectToRabbitMQ, getChannel } from "@/services/RabbitMQ_Service";
import webSocketService from "@/services/WebSocket_Service";
import { routers } from "@/routers/index_Router";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createRandomPosts, createRandomUsers } from "@/db/seeds/index_Seed";
import { Workers } from "@/worker/index_Worker";

const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: "https://localhost:8081",
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../public")));
// View engine
app.set("view engine", "ejs");
app.set("views", "src/views");

// Routes
routers(app);

// Start server
const startServer = async () => {
  console.log("🚀 Starting server...");

  try {
    const db = new ConnectDB();
    await db.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }

  try {
    await connectToRabbitMQ();
    console.log("✅ RabbitMQ connected");
    const channel = await getChannel("FollowNotification");
    console.log("✅ RabbitMQ channel created for queue: FollowNotification");
  } catch (error) {
    console.error("❌ Error connecting to RabbitMQ:", error);
    process.exit(1);
  }

  try {
    await webSocketService.start(8080);
    console.log("✅ WebSocket service initialized");
  } catch (error) {
    console.error("❌ Error starting WebSocket service:", error);
    process.exit(1);
  }

  try {
    await Workers();
    console.log("✅ Workers service initialized");
  } catch (error) {
    console.error("❌ Error starting Worker service:", error);
    process.exit(1);
  }

  // await createRandomUsers(4);
  // await createRandomPosts(20);

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

startServer();
