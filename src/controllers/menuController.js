import asyncHandler from "express-async-handler";
import Menu from "../models/menu.js";
import AppError from "../utils/AppError.js";

// Create a new menu item
export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  const menuItem = await Menu.create({ name, description, price, category });
  res.status(201).json({
    success: true,
    message: "Menu item created successfully",
    menuItem,
  });
});

// Get all menu items
export const getMenuItems = asyncHandler(async (req, res, next) => {
  const { category, sort } = req.query;

  const filter = category ? { category } : {};
  const order = sort === "asc" || sort === "desc" ? [["price", sort]] : [];

  const menuItems = await Menu.findAll({
    where: filter,
    order,
  });
  if (menuItems.length === 0) {
    return next(new AppError("No menu items found", 404));
  }

  res.status(200).json({
    success: true,
    menuItems,
  });
});

// Get a single menu item by ID
export const getMenuItemById = asyncHandler(async (req, res, next) => {
  const menuItem = await Menu.findByPk(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  res.status(200).json({
    success: true,
    menuItem,
  });
});

// Update a menu item
export const updateMenuItem = asyncHandler(async (req, res, next) => {
  const { name, description, price, category } = req.body;

  const menuItem = await Menu.findByPk(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price || menuItem.price;
  menuItem.category = category || menuItem.category;

  await menuItem.save();

  res.status(200).json({
    success: true,
    message: "Menu item updated successfully",
    menuItem,
  });
});

// Delete a menu item
export const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await Menu.findByPk(req.params.id);

  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  await menuItem.destroy();

  res.status(200).json({
    success: true,
    message: "Menu item deleted successfully",
  });
});
// Create multiple menu items
export const createBulkMenus = asyncHandler(async (req, res) => {
  const menus = req.body; // Expecting an array of menus
  const createdMenus = await Menu.bulkCreate(menus);

  res.status(201).json({
    success: true,
    message: `${createdMenus.length} menu items added successfully!`,
  });
});
