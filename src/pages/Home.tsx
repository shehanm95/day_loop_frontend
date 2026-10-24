import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">DayLoop Explorer</h1>
          <nav className="space-x-4">
            <Link to="/locations" className="text-gray-600 hover:text-indigo-600 font-medium">
              Explore Locations
            </Link>
            <Link
              to="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center flex-grow flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Discover Local Attractions with <span className="text-indigo-600">DayLoop</span>
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Explore stunning sights, categories, and day-visit plans seamlessly. No account required to browse.
        </p>
        <div className="mt-5 max-w-md mx-auto flex justify-center md:mt-8 space-x-4">
          <Link
            to="/locations"
            className="rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            Browse Locations
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DayLoop. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;