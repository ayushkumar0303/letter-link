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

export const getLetters = async (req, res) => {
  const { userId } = req.params;

  console.log(userId);
  // console.log(req.user.id);

  if (req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to get the letters");
  }
  // console.log(userId);
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    // console.log(startIndex);
    // console.log(limit);
    // console.log(sortDirection);

    const letters = await Letter.find({
      ...(req.params.userId && { userId: req.params.userId }),
      ...(req.query.letterId && { _id: req.query.letterId }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // console.log(letters);
    res.status(200).json({
      letters,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteLetter = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to delete this post");
  }

  try {
    await Letter.findByIdAndDelete(req.params.letterId);
    return res.status(200).json("The Letter is deleted");
  } catch (error) {
    return res.status(403).json(error.message);
  }
};

export const updateLetter = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json("You are not allowed to update this letter");
  }
  try {
    const updatedLetter = await Letter.findByIdAndUpdate(
      req.params.letterId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Draft updated successfully", updatedLetter });
  } catch (error) {
    return res.status(403).json(error.message);
  }
};
