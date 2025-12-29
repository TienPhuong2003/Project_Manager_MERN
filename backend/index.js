import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
  
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Task Management API" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal-Server Error" });
});

//not found middleware
app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
