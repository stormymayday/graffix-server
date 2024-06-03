import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// JSON Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/", (req, res) => {
    console.log(req);
    res.json({ message: "data received", data: req.body });
});

app.listen(process.env.PORT, () => {
    console.log(`The server is running on port ${process.env.PORT}`);
});
