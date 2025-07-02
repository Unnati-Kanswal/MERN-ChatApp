import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import clientModel from "../models/user.model/user.model.js";

dotenv.config();
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {   //authentication
      console.log( "Unauthorized-No Token Provided!!");
      return res
        .status(401)
        .json({ message: "Unauthorized-No Token Provided!!" });
        
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  //authorization
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized-Invalid Token!!" });

    }
    const user = await clientModel.findById(decoded.userId).select("-password"); //deselect password
    if (!user) {
      return res.status(404).json({ message: "User not found!!" });
    }
    req.user = user; //add user to the req and call the next func
    next();
  } catch (error) {
    console.log("Error in protectRoute", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }

  //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //     if (err) {
  //       return res.status(401).json({ message: "Forbidden!!" });
  //     }
  //     req.user = user;
  //     next();
  //   });
};
