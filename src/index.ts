// server.ts
import express from "express";
import { createServer } from "http";
import ConnectDB from "@/services/MongoDB_Service";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

var corsOptions = {
  origin: "https://localhost:8081",
  optionsSuccessStatus: 200,
};

// Middleware to parse JSON
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ limit: "500mb", extended: true })); // Handle URL-encoded data with large limit
const httpServer = createServer(app);

// Connect to MongoDB
const db = new ConnectDB();
db.connect();

// Start Apollo Server and the HTTP server
const startServer = async () => {
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
};

startServer();

// createRandomUsers(20);
// createRandomPosts(20);
