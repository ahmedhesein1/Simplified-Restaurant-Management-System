import asyncHandler from "express-async-handler";
import Menu from "../models/menu.js";
import AppError from "../utils/AppError.js";
const { Op } = require("sequelize");

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

const { Order, Menu, MenuOrder } = require("./models"); // Adjust with your actual paths

async function exportTopSellingItems() {
  // Get the date 30 days ago from today
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // Aggregate the top 10 selling items
    const topSellingItems = await Menu.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.fn("COUNT", Sequelize.col("MenuOrders.menuId")),
          "orderCount",
        ],
      ],
      include: [
        {
          model: MenuOrder,
          attributes: [], // Don't need extra attributes from the join table
          where: {
            "$MenuOrder.Order.createdAt$": {
              [Op.gte]: thirtyDaysAgo, // Filter orders in the last 30 days
            },
          },
          required: true, // Ensures only menu items that have been ordered are included
        },
      ],
      group: ["Menu.id"],
      order: [[Sequelize.col("orderCount"), "DESC"]], // Sort by the count in descending order
      limit: 10, // Top 10 items
    });

    // Format the results for export (CSV, JSON, etc.)
    const formattedResults = topSellingItems.map((item) => ({
      id: item.id,
      name: item.name,
      orderCount: item.dataValues.orderCount,
    }));

    // Export (example: to CSV)
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: "top_selling_items.csv",
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Item Name" },
        { id: "orderCount", title: "Orders Count" },
      ],
    });

    await csvWriter.writeRecords(formattedResults);
    console.log("CSV file created with top 10 selling items.");
  } catch (error) {
    console.error("Error fetching top selling items:", error);
  }
}

// Call the function
exportTopSellingItems();
