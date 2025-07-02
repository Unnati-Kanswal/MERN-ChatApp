import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log("Database Connection Established Successfully!");
  } catch (error) {
    console.log("Error while connecting to Database", error);
  }
};
export default connectDB;
