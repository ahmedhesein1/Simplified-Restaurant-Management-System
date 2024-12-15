import Order from "./order.js";
import Staff from "./staff.js";
import Menu from "./menu.js";
import MenuOrder from "./menuOrder.js";

// Define associations
// Order belongs to Staff
Order.belongsTo(Staff, {
  foreignKey: 'staffId', // Foreign key in the Order table
  as: 'staff', // Alias for the association
});

// Staff has many Orders
Staff.hasMany(Order, {
  foreignKey: 'staffId', // Foreign key in the Order table
  as: 'orders', // Alias for the association
});


Order.belongsToMany(Menu, {
  through: MenuOrder,
  foreignKey: "orderId",
  otherKey: "menuId",
});

Menu.belongsToMany(Order, {
  through: MenuOrder,
  foreignKey: "menuId",
  otherKey: "orderId",
});
export { Staff, Order, Menu, MenuOrder };