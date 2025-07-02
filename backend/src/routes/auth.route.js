import express from "express";
import {
  signupController,
  signinController,
  signoutController,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/signout", signoutController);
router.put("/update-profile", protectRoute, updateProfile); //authentication+authorization
router.get("/check", protectRoute, checkAuth); //to check user is authenticated or not(when we refresh the page)
export default router;
