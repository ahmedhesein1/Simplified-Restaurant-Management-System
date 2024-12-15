import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MenuOrder = sequelize.define("MenuOrder", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

export default MenuOrder;
