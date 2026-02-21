import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET MEMBERS
router.get("/members", async (req, res) => {
  try {
    const users = await User.find().select("fullName email");

    const formattedUsers = users.map((u, index) => ({
      id: index + 1,
      name: u.fullName,
      role: "Community Member",
      avatar: "👨‍💻",
      joined: "Recently",
      badges: ["🌟 Member"],
      skills: ["Tech Learn"]
    }));

    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
