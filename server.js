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

// Not Found
app.use("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

// Error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
});

app.listen(process.env.PORT || 5100, () => {
    console.log(`The server is running`);
});
