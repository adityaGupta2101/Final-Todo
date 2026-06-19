const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Import controllers
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask
} = require("./controller/taskController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes (MVC style)
// app.get("/tasks", getTasks);
// app.post("/tasks", createTask);
// app.delete("/tasks/:id", deleteTask);
// app.put("/tasks/:id", updateTask);

const taskRoutes = require("./routes/taskRoutes");
// API routes
app.use("/tasks", taskRoutes);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});