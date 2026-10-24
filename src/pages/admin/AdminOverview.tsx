import React from "react";

export const AdminOverview: React.FC = () => {
  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,245</p>
        </div>
        <div className="stat-card">
          <h3>Active Categories</h3>
          <p className="stat-number">24</p>
        </div>
        <div className="stat-card">
          <h3>Listed Locations</h3>
          <p className="stat-number">156</p>
        </div>
      </div>
    </div>
  );
};