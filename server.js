import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";

import mongoose from "mongoose";

// Router Imports
import artRouter from "./routes/artRouter.js";
import authRouter from "./routes/authRouter.js";

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// JSON Middleware
app.use(express.json());

// Routes
app.use("/api/v1/art", artRouter);
app.use("/api/v1/signup", authRouter);

// Not Found
app.use("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

// Error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
});

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
