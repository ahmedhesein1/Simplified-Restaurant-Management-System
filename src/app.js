import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./config/db.js";
import menuRoutes from "./routes/menuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import globalErrorHandler from "./middlewares/errorHandler.js";
import helmet from "helmet";

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // to set secure HTTP headers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);

// Error Handler
app.use(globalErrorHandler);

// Database Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

export default app;
