import express from "express";
import { google } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/google", google);

export default authRouter;
