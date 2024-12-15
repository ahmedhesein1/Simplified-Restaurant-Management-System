import express from "express";
import * as authController from "../controllers/authController.js";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();
router
  .route("/")
  .get(authController.protect,authController.authorize(["admin"]), orderController.getAllOrders)
  .post(orderController.createOrder);
router.post("/add-item", orderController.addItemToOrder);
router.post("/remove-item", orderController.removeItemFromOrder);
router.get("/complete", orderController.completeOrder);
// Endpoint for analytics
router.get("/analytics", orderController.getOrderAnalytics);

export default router;
