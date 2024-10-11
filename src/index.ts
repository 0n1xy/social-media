import express from "express";
import ConnectDB from "@/services/MongoDB_Service";
import dotenv from "dotenv";
import { routers } from "@/routers/index_Router";
import bodyParser from "body-parser";
// Load environment variables
dotenv.config();

import { createRandomPosts, createRandomUsers } from "@/db/seeds/index_Seed";
const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
createRandomUsers(20);
createRandomPosts(20);
