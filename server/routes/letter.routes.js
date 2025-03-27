import express from "express";
import {
  deleteLetter,
  getLetters,
  saveDraft,
  updateLetter,
} from "../controllers/letter.controllers.js";
import verifyToken from "../utils/verifyToken.js";

const letterRouter = express.Router();

letterRouter.post("/save-draft/:userId", verifyToken, saveDraft);
letterRouter.get("/get-letters/:userId", verifyToken, getLetters);
letterRouter.delete(
  "/delete-letter/:letterId/:userId",
  verifyToken,
  deleteLetter
);
letterRouter.put("/update-letter/:userId", verifyToken, updateLetter);
export default letterRouter;
