import express from "express";
import {
  driveCallback,
  driveConnect,
  driveUpload,
  getDriveLetters,
} from "../controllers/drive.controllers.js";
import verifyToken from "../utils/verifyToken.js";

const driveRouter = express.Router();

driveRouter.get("/connect/:userId", verifyToken, driveConnect);
driveRouter.get("/callback", driveCallback);
driveRouter.post("/upload-drive/:userId", verifyToken, driveUpload);
driveRouter.get("/get-letters/:userId", verifyToken, getDriveLetters);

export default driveRouter;
