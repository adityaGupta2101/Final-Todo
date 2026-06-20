const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
 deleteTask,
  updateTask
} = require("../controller/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// protected routes
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;