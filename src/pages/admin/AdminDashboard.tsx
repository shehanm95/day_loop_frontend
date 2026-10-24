import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Admin Portal</h2>
          <span className="admin-badge">Management</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin"
            className={`sidebar-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            📊 Dashboard Overview
          </Link>
          <Link
            to="/admin/users"
            className={`sidebar-link ${location.pathname.includes("/admin/users") ? "active" : ""}`}
          >
            👥 Manage Users
          </Link>
          <Link
            to="/admin/categories"
            className={`sidebar-link ${location.pathname.includes("/admin/categories") ? "active" : ""}`}
          >
            📁 Categories
          </Link>
          <Link
            to="/admin/locations"
            className={`sidebar-link ${location.pathname.includes("/admin/locations") ? "active" : ""}`}
          >
            📍 Locations
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user-info">
            <p className="user-email">{user?.email || "Admin User"}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area containing Outlet for nested child routes */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="topbar-title">
            {location.pathname === "/admin" && "Dashboard Overview"}
            {location.pathname.includes("/admin/users") && "User Management"}
            {location.pathname.includes("/admin/categories") && "Category Management"}
            {location.pathname.includes("/admin/locations") && "Location Management"}
          </h1>
          <div className="topbar-actions">
            <a href="/" className="home-link" target="_blank" rel="noreferrer">
              Visit Site ↗
            </a>
          </div>
        </header>

        <div className="admin-content-area">
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;