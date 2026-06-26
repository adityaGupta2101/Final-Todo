import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================
  // Email Login
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Google Login
  // ==========================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Google Login Successful 🎉");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>

        <p className="auth-subtitle">
          Login to continue managing your tasks
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Enter Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        <div
          style={{
            margin: "25px 0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "12px",
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            OR
          </p>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;