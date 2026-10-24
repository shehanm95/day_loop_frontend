import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import toast from "react-hot-toast";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toastId = toast.loading("Logging in...");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      // Redirect to admin dashboard upon successful admin login
      toast.success("Login successful!", { id: toastId });
      navigate("/admin");
    } catch (err: any) {
        toast.error(err.message || "Failed to login. Please check your credentials.", {
        id: toastId,
      });
      console.error("Login failed:", err);
      setError(err.response?.data?.detail || err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            Admin Portal Login
          </h2>
          <p className="login-subtitle">
            Restricted access: Administrators only
          </p>
        </div>

        {error && (
          <div className="login-error-alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="login-back-link">
            ← Back to Public Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;