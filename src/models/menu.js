import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Menu = sequelize.define("Menu", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Menu item name cannot be empty" },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: "Price must be a number" },
      min: { args: [0], msg: "Price must be greater than or equal to 0" },
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Category cannot be empty" },
    },
  },
});

export default Menu;
