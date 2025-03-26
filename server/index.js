import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import letterRouter from "./routes/letter.routes.js";
import driveRouter from "./routes/drive.routes.js";
// import cors from "cors";

// import path from "path";

const app = express();

dotenv.config();

// app.use(
//   cors({
//     // origin: "http://localhost:5173", // Replace with your front-end URL
//     // credentials: true, // Allow credentials (cookies, authorization headers)
//   })
// );
app.use(express.json());
app.use(cookieParser());

// const __dirname = path.resolve();

// console.log(process.env);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// app.use(express.static(path.join(__dirname, "/client/dist")));
app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});

app.use("/server/auth", authRouter);
app.use("/server/letter", letterRouter);
app.use("/server/drive", driveRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    status: statusCode,
    message,
  });
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });
