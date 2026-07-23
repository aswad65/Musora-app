import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/database/db.js";
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import musicRoutes from "./src/routes/Musicroutes.js";
import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
import cors from "cors";

const app = express();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_API_Key,
  api_secret: process.env.Cloud_API_Secret,
});

      
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/music", musicRoutes);

app.use("/api/users", userRoutes);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
    connectDB();
});

