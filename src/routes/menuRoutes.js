import express from "express";
import * as menuController from "../controllers/menuController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.authorize(["admin"]),
    menuController.createMenuItem
  ) // Admin only
  .get(menuController.getMenuItems); // Public route

router
  .route("/:id")
  .get(menuController.getMenuItemById) // Public route
  .post(
    authController.protect,
    authController.authorize(["admin"]),
    menuController.updateMenuItem
  ) // Admin only
  .delete(
    authController.protect,
    authController.authorize(["admin"]),
    menuController.deleteMenuItem
  ); // Admin only

export default router;
