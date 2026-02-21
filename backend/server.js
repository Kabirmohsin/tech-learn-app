import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// ✅ UPDATED CORS for production
app.use(cors({
  origin: [
    "https://tech-learn-frontend-kabir.onrender.com", // Your frontend URL
    "http://localhost:5173" // For local development
  ],
  credentials: true
}));

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
