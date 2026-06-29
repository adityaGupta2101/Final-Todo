const Task = require("../models/Task");

// @desc    Get logged-in user's tasks
// @route   GET /tasks
const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {
      user: req.user.id,
      task: {
        $regex: search,
        $options: "i",
      },
    };

    // Current page tasks
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total searched tasks
    const totalTasks = await Task.countDocuments(query);

    // Overall stats
    const completedTasks = await Task.countDocuments({
      user: req.user.id,
      completed: true,
    });

    const pendingTasks = await Task.countDocuments({
      user: req.user.id,
      completed: false,
    });

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc    Create a new task for logged-in user
// @route   POST /tasks
const createTask = async (req, res) => {
  try {
    if (!req.body.task) {
      return res.status(400).json({ message: "Task is required" });
    }

    const newTask = await Task.create({
      task: req.body.task,
      user: req.user.id
    });

    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task of logged-in user
// @route   DELETE /tasks/:id
const deleteTask = async (req, res) => {
  
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    console.log("Deleting task with ID:", req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task of logged-in user
// @route   PUT /tasks/:id
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask
};