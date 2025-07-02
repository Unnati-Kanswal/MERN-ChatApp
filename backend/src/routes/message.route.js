import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();
router.get("/users", protectRoute, getUsersForSidebar); //fetchings users for the contactList except us(loffegInUser)
router.get("/:id", protectRoute, getMessages); //getting messages with the another users
router.post("/send/:id", protectRoute, sendMessage); //for sending mssgs to other user(":id")
export default router;
