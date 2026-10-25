import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import type { LocationResponse } from "../../types/location";
import { locationService } from "../../services/locationService";
import "./LocationDetail.css";

export const LocationDetailView: React.FC = () => {
  // Extract location ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management for location details, loading, and error
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format image URLs correctly
  const getImageUrl = (url?: string | null) => {
    if (!url) return "https://via.placeholder.com/400x200?text=No+Image";
    return url.startsWith("http") ? url : `http://localhost:8000${url}`;
  };

  // Fetch location details by ID when component mounts or ID changes
  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!id) {
        setError("Invalid location ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await locationService.getLocationById(Number(id));
        setLocation(data);
      } catch (err: any) {
        console.error("Error fetching location details:", err);
        setError("Failed to load location details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error || "Location not found."}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-primary"
        >
          &larr; Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="location-detail-container">
      {/* Navigation & Action Buttons */}
      <div className="location-detail-nav">
        <button
          onClick={() => navigate(-1)}
          className="location-detail-back-btn"
        >
          &larr; Back to List
        </button>

        <div className="location-detail-actions">
          <button
            onClick={() => {
              alert(`Added ${location.name} to your route!`);
            }}
            className="btn btn-secondary"
          >
            + Add to Routes
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="location-detail-main-card">
        {/* Cover Image Header */}
        <div className="location-detail-hero">
          <img
            src={getImageUrl(location.cover_image)}
            alt={location.name}
          />
          <div className="location-detail-hero-overlay">
            <div className="text-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {location.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 bg-indigo-600/90 text-xs font-semibold rounded-full uppercase tracking-wider"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">{location.name}</h1>
              <p className="text-sm text-gray-200 mt-1">
                {location.city}, {location.district}, {location.province} province
              </p>
            </div>
          </div>
        </div>

        {/* Details & Sidebar Layout */}
        <div className="location-detail-grid">
          {/* Left Column: Description & Info */}
          <div className="location-detail-left space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
              
              {/* 
                Advanced Concept: Safe HTML Rendering & Overflow Prevention
                - DOMPurify sanitizes raw HTML strings to prevent XSS vulnerabilities.
                - The wrapper class ensures long descriptions wrap correctly without breaking grid boundaries.
              */}
              <div
                className="location-description-content text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(location.description || ""),
                }}
              />
            </div>

            {/* Key Information Cards */}
            <div className="location-info-cards-grid">
              <div className="location-info-card">
                <span className="block text-xs font-medium text-gray-500 uppercase">Opening Hours</span>
                <span className="text-gray-900 font-semibold">
                  {location.opening_time} - {location.closing_time}
                </span>
              </div>
              <div className="location-info-card">
                <span className="block text-xs font-medium text-gray-500 uppercase">Avg. Visit Duration</span>
                <span className="text-gray-900 font-semibold">{location.average_visit_duration} Hours</span>
              </div>
              <div className="location-info-card">
                <span className="block text-xs font-medium text-gray-500 uppercase">Entry Fee</span>
                <div className="text-gray-900 font-semibold">
                  Local: LKR {location.entry_fee_local} | Foreign: USD {location.entry_fee_foreign}
                </div>
              </div>
              <div className="location-info-card">
                <span className="block text-xs font-medium text-gray-500 uppercase">Contact & Web</span>
                <div className="text-gray-900 font-semibold">{location.contact_number}</div>
                {location.website && (
                  <a
                    href={`https://${location.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline break-all"
                  >
                    {location.website}
                  </a>
                )}
              </div>
            </div>

            {/* Gallery Images Section */}
            {location.gallery_images && location.gallery_images.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Gallery</h3>
                <div className="location-gallery-grid">
                  {location.gallery_images.map((img) => (
                    <div key={img.id} className="location-gallery-item">
                      <img
                        src={getImageUrl(img.image_url)}
                        alt={`Gallery item ${img.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Location & Google Map */}
          <div className="location-detail-sidebar space-y-6">
            <div className="location-map-wrapper">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Map</h3>
              <p className="text-sm text-gray-600 mb-4">{location.address}, {location.city}</p>
              
              {/* Google Map Embed using Latitude & Longitude */}
              <div className="location-map-container">
                <iframe
                  title="Google Map Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailView;