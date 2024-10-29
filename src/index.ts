import express from "express";
import ConnectDB from "@/services/MongoDB_Service";
require("dotenv").config();
import { routers } from "@/routers/index_Router";
import bodyParser from "body-parser";
import { createRandomPosts, createRandomUsers } from "@/db/seeds/index_Seed";

const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ limit: "500mb", extended: true })); // Handle URL-encoded data with large limit

//Router
routers(app);

const startServer = async () => {
  try {
    // Initialize MongoDB connection
    const db = new ConnectDB();
    await db.connect();

    // Start the Express server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error); // Log any startup errors
  }
};

startServer();

// createRandomUsers(20);
// createRandomPosts(20);
