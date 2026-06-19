import React, { useState, useEffect } from "react";
import axios from "axios";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ GET tasks from backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // run only once
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ ADD TASK
  const handleAdd = async () => {
    if (task.trim() === "") return;

    try {
      if (editId) {
        // UPDATE
        await axios.put(`http://localhost:5000/tasks/${editId}`, {
          task: task,
        });
        setEditId(null);
      } else {
        // CREATE
        await axios.post("http://localhost:5000/tasks", {
          task: task,
        });
      }

      setTask("");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ DELETE TASK
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ EDIT TASK
  const handleEdit = (item) => {
    setTask(item.task);
    setEditId(item._id);
  };

  return (
    <div className="container">
      <h1>📝 Todo App</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={handleAdd}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul>
        {tasks.map((item) => (
          <li key={item._id}>
            <span>{item.task}</span>

            <div className="btn-group">
              <button onClick={() => handleEdit(item)}>
                Edit
              </button>

              <button onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;