import Letter from "../models/letter.models.js";
import errorHandler from "../utils/error.js";

export const saveDraft = async (req, res, next) => {
  const { userId } = req.params;
  if (req.user.id !== userId) {
    return next(errorHandler(404, "You are not authorised for this action"));
  }
  const { title, content } = req.body;
  // console.log(userId);
  // console.log(content);
  try {
    const draft = new Letter({ userId, title, content });
    await draft.save();
    res.status(201).json({ message: "Draft saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving draft", error });
  }
};

export const uploadLetter = async (req, res, next) => {};
