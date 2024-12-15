import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Protected Routes
router.post("/logout", authController.protect, authController.logout);
router.post(
  "/make-admin",
  authController.protect,
  authController.authorize(["admin"]),
  userController.makeAdmin
);
router.get(
  "/staff",
  authController.protect,
  authController.authorize(["admin"]),
  userController.getAllUsers
);

export default router;
