import express from "express";
import Certificate from "../models/Certificate.js";

const router = express.Router();

// Save Certificate - UPDATED
router.post("/", async (req, res) => {
  try {
    const { userName, domain, score, totalQuestions, date } = req.body;
    const newCert = new Certificate({ 
      userName, 
      domain, 
      score, 
      totalQuestions, 
      date 
    });
    await newCert.save();
    res.status(201).json(newCert);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get All Certificates
router.get("/", async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;