import express from "express";
import ConnectDB from "@/services/MongoDB_Service";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routers } from "@/routers/index_Router";
import { createRandomPosts, createRandomUsers } from "@/db/seeds/index_Seed";
import { createServer } from "http";

dotenv.config();

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
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");
app.set("views", "src/views");

// Routes
routers(app);

// Start server
const startServer = async () => {
  try {
    const db = new ConnectDB();
    await db.connect();

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

// createRandomUsers(2);
// createRandomPosts(20);
