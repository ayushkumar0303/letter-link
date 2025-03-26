import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const google = async (req, res) => {
  const { name, email, profilePicture } = req.body;
  // console.log(profilePicture);
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { password: _pass, ...rest } = user._doc;

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const password = Math.random().toString(36).slice(-8);
      const userName =
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4);
      const hashPassword = bcryptjs.hashSync(password, 10);
      try {
        const newUser = new User({
          username: userName,
          email: email,
          password: hashPassword,
          profilePicture: profilePicture,
        });

        await newUser.save();

        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.SECRET_KEY
        );
        const { password: _pass, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .json(rest);
      } catch (error) {
        return res.status(500).json(error.message);
      }
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
