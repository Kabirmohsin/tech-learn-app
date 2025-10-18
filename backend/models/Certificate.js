import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  domain: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  date: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;