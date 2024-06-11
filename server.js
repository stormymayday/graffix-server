import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Router Imports
import artworkRouter from "./routes/artworkRouter.js";
import authRouter from "./routes/authRouter.js";

// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authenticationMiddlware.js";

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// Cookie Parser Middleware
app.use(cookieParser());
// JSON Middleware
app.use(express.json());

// Routes
app.use("/api/v1/art", authenticateUser, artworkRouter);
app.use("/api/v1/auth", authRouter);

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
