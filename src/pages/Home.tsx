import React, { useState } from "react";
import LandingHeaderNav from "./landing/LandingHeaderNav";
import { Outlet } from "react-router-dom";

export const Home: React.FC = () => {


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navbar */}
      <LandingHeaderNav />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center flex-grow flex flex-col justify-center">
        <Outlet></Outlet>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DayLoop. All rights reserved.
      </footer>
    </div>
  );
};