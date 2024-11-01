import express, { Application } from "express";
import ConnectDB from "@/services/MongoDB_Service";
import dotenv from "dotenv";
import { routers } from "@/routers/index_Router";
import bodyParser from "body-parser";
// Load environment variables
dotenv.config();

import { createRandomUsers } from "@/db/seeds/index_Seed";
const app = express();
const port = process.env.PORT || 3000;;
const cors = require("cors");
const cookieParser = require('cookie-parser'); 

var corsOptions = {
  origin: "https://localhost:8081",
  optionsSuccessStatus: 200
};

// Middleware to parse JSON
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
