import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AdminOverview } from "../pages/admin/AdminOverview";
import { ManageUsers } from "../pages/admin/ManageUsers";
import { ManageCategories } from "../pages/admin/ManageCategories";
import { ManageLocations } from "../pages/admin/ManageLocations";
import AdminLayout from "../pages/admin/AdminDashboard";
import CreateCategory from "../pages/admin/categoryComponents/CreateCategory";
import ViewCategory from "../pages/admin/categoryComponents/ViewCategory";
import EditCategory from "../pages/admin/categoryComponents/EditCategory";
import { CreateLocationForm } from "../pages/admin/locationComponents/CreateLocationForm";
import EditLocationForm from "../pages/admin/locationComponents/EditLocationForm";
import { Home } from "../pages/Home";
import LocationListDisplayLanding from "../pages/landing/LocationListDisplayLanding";
import LocationDetailView from "../pages/landing/LocationDetailView";

// Strict Admin Protected Route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // If there's no token, redirect straight to the admin login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES: Anyone can view home */}
        <Route path="/" element={<Home />}>
          <Route path="list" element={<LocationListDisplayLanding />} />
          <Route path="view/:id" element={<LocationDetailView />} />
        </Route>

        {/* AUTH ROUTE: Only for Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN-ONLY PROTECTED ROUTES WITH NESTED OUTLET */}
        <Route
          path="/admin/"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Default view when navigating to /admin */}
          <Route index element={<AdminOverview />} />
          
          {/* Sub-pages rendered inside AdminLayout's <Outlet /> */}
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="categories/view/:id" element={<ViewCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          <Route path="locations" element={<ManageLocations />} />
          <Route path="locations/create" element={<CreateLocationForm />} />
          <Route path="locations/edit/:id" element={<EditLocationForm />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};