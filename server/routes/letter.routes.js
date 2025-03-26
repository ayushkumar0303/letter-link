import express from "express";
import { saveDraft, uploadLetter } from "../controllers/letter.controllers.js";
import verifyToken from "../utils/verifyToken.js";

const letterRouter = express.Router();

letterRouter.post("/save-draft/:userId", verifyToken, saveDraft);

export default letterRouter;
