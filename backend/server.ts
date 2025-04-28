import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorhandler";

const app = express();

app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cookieParser());

app.use("/api/auth");

// custom error handler middleware
app.use(errorHandler);

app.listen(5000, () => {console.log("Server started on port 5000")});

export default app;
