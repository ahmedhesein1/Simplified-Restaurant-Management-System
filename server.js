// src/server.js
import app from "./src/app.js"; // Import the app setup
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000; // Set port from .env or default to 5000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
