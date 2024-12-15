import cron from "node-cron";
import { Op } from "sequelize";
import Order from "./models/order.js";

// Run a cron job every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  const expiredOrders = await Order.update(
    { status: "expired" },
    {
      where: {
        status: "pending",
        createdAt: { [Op.lt]: new Date(Date.now() - 4 * 60 * 60 * 1000) }, // Orders older than 4 hours
      },
    }
  );

  console.log(`Expired ${expiredOrders[0]} orders`);
});
