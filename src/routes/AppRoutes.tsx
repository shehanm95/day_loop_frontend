import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import LocationList from "../pages/locations/LocationList";
import LocationDetail from "../pages/locations/LocationDetail";
import { useAuth } from "../context/AuthContext";

// Strict Admin Protected Route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // If there's no token, redirect straight to the admin login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // You can also check role flags here once context is fully populated
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES: Anyone can view home, locations, and details without logging in */}
        <Route path="/" element={<Home />} />
        <Route path="/locations" element={<LocationList />} />
        <Route path="/locations/:id" element={<LocationDetail />} />

        {/* AUTH ROUTE: Only for Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN-ONLY PROTECTED ROUTES: Manage categories, locations, and view users */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};