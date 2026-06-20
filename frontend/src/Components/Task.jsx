import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // GET tasks from backend
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);

      // if token invalid / expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // check login + fetch tasks
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  // ADD or UPDATE task
  const handleAdd = async () => {
    if (task.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/tasks/${editId}`,
          { task },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/tasks",
          { task },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      setTask("");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT TASK
  const handleEdit = (item) => {
    setTask(item.task);
    setEditId(item._id);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container">
      <div style={styles.topBar}>
        <h1>📝 Todo App</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

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
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Task;