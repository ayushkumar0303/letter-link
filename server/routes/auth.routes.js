import express from "express";
import { google, userSignOut } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/google", google);
authRouter.post("/signout", userSignOut);

export default authRouter;
