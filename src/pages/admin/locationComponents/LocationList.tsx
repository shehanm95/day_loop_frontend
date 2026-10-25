import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { type LocationResponse as Location } from "../../../types/location";
import { locationService } from "../../../services/locationService";
import LocationListItem from "./LocationListItem";
import '../categoryComponents/categorylist.css'
import LocationSelector from "./LocationSelector";

export const LocationList: React.FC = () => {
  // State for storing the list of locations
  const [locations, setLocations] = useState<Location[]>([]);
  
  // Loading state to track network requests
  const [loading, setLoading] = useState<boolean>(true);
  
  // Error state to catch and display any API errors
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Fetch locations using locationService when the component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calling the location service method to get all locations
        const data = await locationService.getLocations();
        setLocations(data);
      } catch (err: any) {
        console.error("Failed to load locations:", err);
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load locations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Navigate to the create location page
  const handleAddNew = () => {
    navigate("/admin/locations/create");
  };

  // Navigate to view a specific location's details
  const handleView = (location: Location) => {
    console.log("View location:", location);
    navigate(`/admin/locations/view/${location.id}`);
  };

  // Navigate to edit a specific location
  const handleEdit = (location: Location) => {
    console.log("Edit location:", location);
    navigate(`/admin/locations/edit/${location.id}`);
  };

  // Handle deletion of a location with confirmation prompt
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await locationService.deleteLocation(id);
        
        // Filter out the deleted location from local state to update UI instantly
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      } catch (err: any) {
        console.error("Failed to delete location:", err);
        alert(err.response?.data?.detail || "Failed to delete location.");
      }
    }
  };

  return (
    <div className="category-management-container">
      {/* Top Bar: Title, Subtitle, and Add New Button */}
      <div className="category-header-bar">
        <div>
          <h2 className="section-title">Locations</h2>
          <p className="section-subtitle">Manage tourism locations and destinations</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          + Add New Location
        </button>
      </div>

      {/* Error & Loading States */}
      {loading && <p className="loading-text">Loading locations...</p>}
      {error && <div className="alert-error">{error}</div>}

      {/* Location List Area */}
      <div className="category-list-wrapper">
        {!loading && !error && locations.length === 0 ? (
          <div className="empty-state">
            <p>No locations found. Click "Add New Location" to create one.</p>
          </div>
        ) : (
          locations.map((location) => (
            <LocationListItem
              key={location.id}
              location={location}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LocationList;