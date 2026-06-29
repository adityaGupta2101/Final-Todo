import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
const [completedTasks, setCompletedTasks] = useState(0);
const [pendingTasks, setPendingTasks] = useState(0);
  const [editId, setEditId] = useState(null);

  // SEARCH STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // GET tasks from backend
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
     const response = await axios.get(
     `http://localhost:5000/tasks?page=${currentPage}&limit=2&search=${searchTerm}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);

setTotalTasks(response.data.totalTasks);
setCompletedTasks(response.data.completedTasks);
setPendingTasks(response.data.pendingTasks);
    } catch (error) {
      console.error("Error fetching data:", error);

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
}, [navigate, currentPage, searchTerm]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // TOGGLE COMPLETE / PENDING
  const handleToggleComplete = async (item) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/tasks/${item._id}`,
        { completed: !item.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =========================
     SEARCH LOGIC
  ========================= */

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matchedTasks = tasks.filter((item) =>
      item.task.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(matchedTasks);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (taskText) => {
    setSearchTerm(taskText);
    setShowSuggestions(false);
  };

  // FILTERED TASKS
  const filteredTasks = tasks.filter((item) =>
    item.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // // stats
  // const totalTasks = tasks.length;
  // const completedTasks = tasks.filter((item) => item.completed).length;
  // const pendingTasks = tasks.filter((item) => !item.completed).length;

  return (
    <div className="container">
      {/* Header */}
      <div className="todo-header">
        <div className="todo-header-left">
          <h1>📝 My Todo Dashboard</h1>
          <p className="todo-subtitle">
            Organize your day, manage your tasks, and stay productive.
          </p>
        </div>

        <div className="todo-header-right">
          <div className="welcome-box">
            <span className="welcome-text">Welcome back</span>
            <div className="user-box">
              <div className="user-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="user-name">{user?.name || "User"}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card total-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h2>{totalTasks}</h2>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card completed-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h2>{completedTasks}</h2>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h2>{pendingTasks}</h2>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Add / Update Task */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAdd} className="add-btn">
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          onFocus={() => {
            if (searchTerm.trim() !== "") setShowSuggestions(true);
          }}
        />

        {showSuggestions && searchTerm.trim() !== "" && (
          <div className="suggestions-box">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item._id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.task)}
                >
                  {item.task}
                </div>
              ))
            ) : (
              <div className="suggestion-item no-result">
                No matching task found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Section */}
      {/* Task Section */}
<div className="tasks-section">
  <h2 className="section-title">Your Tasks</h2>

  {filteredTasks.length > 0 ? (
    <>
      <ul className="task-list">
        {filteredTasks.map((item) => (
          <li
            key={item._id}
            className={`task-item ${item.completed ? "task-completed" : ""}`}
          >
            <div className="task-left">
              <div className="task-title-row">
                <span className="task-badge-icon">
                  {item.completed ? "✅" : "📌"}
                </span>

                <div className="task-text-group">
                  <span className="task-title">{item.task}</span>

                  <span
                    className={`task-status ${
                      item.completed
                        ? "status-completed"
                        : "status-pending"
                    }`}
                  >
                    {item.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="btn-group">
              <button
                onClick={() => handleToggleComplete(item)}
                className={item.completed ? "undo-btn" : "complete-btn"}
              >
                {item.completed ? "Undo" : "Complete"}
              </button>

              <button
                onClick={() => handleEdit(item)}
                className="edit-btn"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ⬅ Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next ➡
        </button>
      </div>
    </>
  ) : (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h3>No matching tasks found</h3>
      <p>Try searching with a different keyword.</p>
    </div>
  )}
</div>
      
          
        
       

      <p className="footer-note">
        Stay consistent. Small tasks completed daily lead to big results.
      </p>
    </div>
  );
};

export default Task;