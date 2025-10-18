import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ ADD THIS LINE

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes); // ✅ ADD THIS LINE

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));