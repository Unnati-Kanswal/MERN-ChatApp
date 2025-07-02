import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.route.js";
import connectDB from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./src/routes/message.route.js";
import cors from "cors";
import { app, server } from "./src/lib/socket.js";
import path from "path";

dotenv.config();
const port = process.env.PORT || 5006;
const __dirname = path.resolve();
app.use(express.json()); //to extract json data from req.body
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", //which domain can access server's resources
    credentials: true, //tells browser about credentials like (cookies,authorization header included with req)
  })
);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
