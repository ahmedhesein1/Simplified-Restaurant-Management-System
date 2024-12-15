import asyncHandler from "express-async-handler";
import { Order, MenuOrder, Staff, Menu } from "../models/associations.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
import { Parser } from "json2csv"; // For CSV export
import * as XLSX from "xlsx"; // For XLSX export
import fs from "fs"; // For writing files
// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const { staffId, menuItems } = req.body; // Destructure the staffId and menuItems from the request body

  // Create the new order with "pending" status
  const order = await Order.create({
    staffId,
    status: "pending",
  });

  // Loop through the menu items in the order and add each item to the order
  for (const item of menuItems) {
    const menu = await Menu.findByPk(item.menuId); // Find the menu item by ID
    if (menu) {
      // Add the menu item to the MenuOrder table with the quantity
      await MenuOrder.create({
        orderId: order.id,
        menuId: menu.id,
        quantity: item.quantity,
      });
    }
  }

  // Respond with the newly created order
  res.status(201).json({ success: true, order });
});

// Add an item to an existing order
export const addItemToOrder = asyncHandler(async (req, res, next) => {
  const { orderId, menuId, quantity } = req.body; // Destructure the request body

  // Find the existing order by orderId
  const order = await Order.findByPk(orderId);
  // If the order doesn't exist or is already completed, return an error
  if (!order || order.status === "completed") {
    return next(new AppError("Order not found or Already Completed", 400));
  }

  // Find the menu item by menuId
  const menuItem = await Menu.findByPk(menuId);
  // If the menu item doesn't exist, return an error
  if (!menuItem) {
    return next(new AppError("Menu item not found", 404));
  }

  // Add the item to the order in the MenuOrder table
  await MenuOrder.create({
    orderId: order.id,
    menuId: menuItem.id,
    quantity,
  });

  // Respond with a success message and the updated order
  res.status(201).json({
    success: true,
    message: "Item added to order",
    order,
  });
});

// Remove an item from an existing order
export const removeItemFromOrder = asyncHandler(async (req, res, next) => {
  const { orderId, menuId } = req.body; // Destructure the request body

  // Find the existing order by orderId
  const order = await Order.findByPk(orderId);
  // If the order doesn't exist or is already completed, return an error
  if (!order || order.status === "completed") {
    return next(new AppError("Order not found or Completed", 400));
  }

  // Find the menu item in the order by orderId and menuId
  const menuOrder = await MenuOrder.findOne({ where: { orderId, menuId } });
  // If the menu item is not in the order, return an error
  if (!menuOrder) {
    return next(new AppError("Item not found in the order", 404));
  }

  // Delete the item from the MenuOrder table
  await menuOrder.destroy();

  // Respond with a success message and the updated order
  res
    .status(200)
    .json({ success: true, message: "Item removed from order", order });
});

// Mark an order as complete
export const completeOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body; // Destructure the orderId from the request body

  // Find the order by orderId
  const order = await Order.findByPk(orderId);
  // If the order doesn't exist or is already completed, return an error
  if (!order || order.status === "completed") {
    return next(new AppError("Order not found or Already completed", 404));
  }

  // Update the order status to "completed"
  order.status = "completed";
  await order.save();

  // Respond with a success message and the updated order
  res.status(200).json({
    success: true,
    message: "Order marked as completed",
    order,
  });
});

// Get all orders (Admin only)
export const getAllOrders = asyncHandler(async (req, res, next) => {
  // Retrieve all orders along with staff and menu details
  const orders = await Order.findAll({
    include: [
      {
        model: Staff, // Include the staff who created the order
        as: "staff", // Use the alias defined in the association
        attributes: ["id", "name"], // Only select the name of the staff
      },
      {
        model: Menu, // Include the menu items in the order
        attributes: ["name", "price"], // Select the menu name and price
        through: { attributes: ["quantity"] }, // Include quantity from the join table MenuOrder
      },
    ],
  });

  // If no orders are found, return an error
  if (!orders) {
    return next(new AppError("No orders found.", 404));
  }

  // Respond with the list of orders and their details
  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// Get analytics and optionally export data
export const getOrderAnalytics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, exportFormat } = req.query;

  // Validate dates
  if (!startDate || !endDate) {
    return next(new AppError("Both startDate and endDate are required", 400));
  }

  // Fetch filtered orders
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    include: [
      {
        model: Menu,
        through: { model: MenuOrder },
      },
    ],
  });

  // Calculate analytics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.Menus.reduce((menuSum, menu) => {
      const menuOrder = menu.MenuOrder;
      return menuSum + menu.price * menuOrder.quantity;
    }, 0);
    return sum + orderTotal;
  }, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Prepare response data
  const analytics = {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    startDate,
    endDate,
  };

  // Handle data export
  if (exportFormat === "csv" || exportFormat === "xlsx") {
    const data = orders.map((order) => ({
      orderId: order.id,
      createdAt: order.createdAt,
      status: order.status,
      revenue: order.Menus.reduce((menuSum, menu) => {
        const menuOrder = menu.MenuOrder;
        return menuSum + menu.price * menuOrder.quantity;
      }, 0),
    }));

    if (exportFormat === "csv") {
      // Convert to CSV
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);

      // Send CSV file
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="orders_${startDate}_${endDate}.csv"`
      );
      return res.status(200).send(csv);
    } else if (exportFormat === "xlsx") {
      // Convert to XLSX
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Write file
      const filePath = `orders_${startDate}_${endDate}.xlsx`;
      XLSX.writeFile(workbook, filePath);

      // Send XLSX file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="orders_${startDate}_${endDate}.xlsx"`
      );
      return res.status(200).send(fs.readFileSync(filePath));
    }
  }

  // Return analytics if no export
  res.status(200).json({
    success: true,
    analytics,
    orders,
  });
});
