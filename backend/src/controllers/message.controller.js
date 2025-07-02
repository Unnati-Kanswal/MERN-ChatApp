import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import messageModel from "../models/message.model/message.model.js";
import clientModel from "../models/user.model/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; //middleware(protectroute)
    const filteredUsers = await clientModel
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password"); // Mongoose query method used to control which fields are included (or excluded) in the result of a query.
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id; //from protectRoute
  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }); //The $or operator in MongoDB (and Mongoose) is used to match documents that satisfy at least one of the specified conditions.
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params; //reciever
  const senderId = req.user._id; //sender
  try {
    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }
    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();
    //socket.io (realTimeFunctionality)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
