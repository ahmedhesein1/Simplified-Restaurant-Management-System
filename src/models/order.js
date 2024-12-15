import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define("Orders", {
  status: {
    type: DataTypes.ENUM("pending", "completed", "expired"),
    defaultValue: "pending",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Staffs", // Referencing the Staff table
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

export default Order;
