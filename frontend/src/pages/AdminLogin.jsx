import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const { login, admin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="admin-loading">Loading admin access...</div>;
  }

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-logo">AO</div>
          <div>
            <p className="eyebrow">Admin Portal</p>
            <h1>Anish Ojha Tuition</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
