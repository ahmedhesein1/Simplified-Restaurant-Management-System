import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Staff = sequelize.define("Staff", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name cannot be empty" },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Please provide a valid email address" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password cannot be empty" },
    },
  },
  role: {
    type: DataTypes.ENUM("admin", "staff"),
    allowNull: false,
    defaultValue: "staff",
    validate: {
      isIn: {
        args: [["admin", "staff"]],
        msg: "Role must be either 'admin' or 'staff'",
      },
    },
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Staff;
