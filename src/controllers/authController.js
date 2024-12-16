import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import Staff from "../models/staff.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
// Protect middleware (for authenticated routes)
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(new AppError("You are not authorized", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const staff = await Staff.findByPk(decoded.id);
  if (!staff) return next(new AppError("User not found", 404));
  req.staff = staff;
  next();
});

// Role-based authorization middleware
export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.staff.role)) {
    return next(new AppError("Forbidden: Insufficient permissions", 403));
  }
  next();
};

// Signup functionality
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const staff = await Staff.findOne({ where: { email } });
  if (staff) return next(new AppError("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 10);
  // Check if this is the first user
  const isFirstUser = (await Staff.count()) === 0;

  const newStaff = await Staff.create({
    name,
    email,
    password: hashedPassword,
    role: isFirstUser ? "admin" : "staff", // Assign 'admin' role to the first user
  });
  res.status(201).json({
    success: true,
    message: "User created successfully",
    staff: {
      id: newStaff.id,
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
    },
  });
});

// Login functionality
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const staff = await Staff.findOne({ where: { email } });
  if (!staff || !(await bcrypt.compare(password, staff.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = jwt.sign({ id: staff.id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
  res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json({
      success: true,
      message: "Logged in successfully",
      staff: { id: staff.id, name: staff.name, role: staff.role, token },
    });
});

// Logout functionality
export const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// Forgot password functionality
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await Staff.findOne({ where: { email } });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour from now

  // Save token and expiry to the user record
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;
  await user.save();
  // Send reset password email
  res.status(200).json({
    success: true,
    message: "Reset token email generated successfully",
    resetToken,
  });
});

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await Staff.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: { [Op.gt]: Date.now() },
    },
  });
  if (!user) {
    return next(new AppError("Invalid Or Expired Token", 400));
  }
  // Update Password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiresAt = null;
  await user.save();
  // Send success email
  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
