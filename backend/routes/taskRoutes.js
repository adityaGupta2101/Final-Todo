const express = require("express");
const router = express.Router();

// import controller functions
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask
} = require("../controller/taskController");

// Routes

// GET all tasks
router.get("/", getTasks);

// CREATE task
router.post("/", createTask);

// UPDATE task
router.put("/:id", updateTask);

// DELETE task
router.delete("/:id", deleteTask);

module.exports = router;