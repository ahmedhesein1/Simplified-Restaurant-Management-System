import asyncHandler from "express-async-handler";
import { Staff } from "../models/associations.js";
import AppError from "../utils/AppError.js";

// Get All The Users [Admins Only]
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findAll({
    attributes: ["id", "name", "email", "role", "lastLogin", "createdAt"], // Exclude sensitive fields like password
  });
  if (staff.length === 0) {
    return next(new AppError("No Staff found", 404));
  }
  res.status(200).json({
    success: true,
    staff,
  });
});

// Update The User Role to Be Admin [Admins only]
export const makeAdmin = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;
  // Validate the role
  if (!["admin", "staff"].includes(role)) {
    return next(
      new AppError("Invalid role. Role must be 'admin' or 'staff'", 400)
    );
  }
  // Check if the user existed
  const user = await Staff.findByPk(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  // Update the role
  user.role = role;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    ...user.toJSON(),
    password: undefined,
  });
});
