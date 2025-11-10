import path from "path";
import bcrypt from "bcryptjs";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use("/uploads", express.static(__dirname + "/uploads"));
const uploadMiddleware = multer({ dest: "uploads/" });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SALT;

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json(userDoc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content, file } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: file,
      author: info.id,
    });
    res.json(postDoc);
  });
});
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  const newUrl = req.body.file;
  if (newUrl) {
    newPath = newUrl;
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      res.status(400).json("You are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);
  });
});
app.post(
  "/deletePost/:id",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params;
      const postDoc = await Post.findById(id);
      if (!postDoc) res.status(400).json("There is not post");
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        res.status(400).json("You are not the author");
      }
      await postDoc.deleteOne({ _id: id });
      res.status(200).json("Post deleted");
    });
  }
);
app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, secret, {}, (err, info) => {
      // if (err) throw err;
      res.json(info);
    });
  } catch (err) {}
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

try {
  const buildPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(buildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} catch (err) {}
app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`)
);
