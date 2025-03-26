import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Letter = mongoose.model("Letter", letterSchema);

export default Letter;
