import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host (e.g., localhost)
    dialect: "postgres", // Use PostgreSQL
    logging: false, // Disable logging for cleaner console output
  }
);

// Sync the database and models
sequelize
.sync({ alter: true })
.then(() => console.log("Database connected and models synced"))
.catch((err) => console.error("Database sync failed:", err));

export default sequelize;
