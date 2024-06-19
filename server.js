import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// Router Imports
import artworkRouter from "./routes/artworkRouter.js";
import authenticationRouter from "./routes/authenticationRouter.js";
import userRouter from "./routes/userRouter.js";
import treasureRouter from "./routes/treasureRouter.js";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authenticationMiddleware.js";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINDARY_NAME,
    api_key: process.env.CLOUDINDARY_API_KEY,
    api_secret: process.env.CLOUDINDARY_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// File Uploads - deprecated
app.use(express.static(path.resolve(__dirname, "./public")));
// Cookie Parser Middleware
app.use(cookieParser());
// JSON Middleware
app.use(express.json());

// Routes
app.use("/api/v1/art", authenticateUser, artworkRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1/treasure", authenticateUser, treasureRouter);

// Not Found
app.use("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

// Error
app.use(errorHandlerMiddleware);

// MongoDB Connection
try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    app.listen(process.env.PORT || 5100, () => {
        console.log(`The server is running`);
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}
