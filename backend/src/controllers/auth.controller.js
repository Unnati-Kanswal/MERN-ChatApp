import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import clientModel from "../models/user.model/user.model.js";
import bcryptjs from "bcryptjs";
export const signupController = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await clientModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist!" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new clientModel({
      email,
      fullName,
      password: hashedPassword,
    });
    if (newUser) {
      //jwt token creation
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User data!" });
    }
  } catch (error) {
    console.log("Error while signup", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await clientModel.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong Credentials!" });
    }
    generateToken(validUser._id, res);
    res.status(200).json({
      _id: validUser._id,
      email: validUser.email,
      fullName: validUser.fullName,
      profilePic: validUser.profilePic,
    });
  } catch (error) {
    console.log("Error while Signin", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

export const signoutController = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "User loggedOut Successfully!" });
  } catch (error) {
    console.log("Error while SignOut", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required!" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await clientModel.findByIdAndUpdate(
      { _id: userId },
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in uploadProfile controller", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user); //sending the authenticated user to the client
  } catch (error) {
    console.log("Error in checkAuth controller", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};
