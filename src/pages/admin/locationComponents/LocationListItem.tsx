import React from "react";
import type { LocationResponse as Location } from "../../../types/location";
import '../categoryComponents/categorylist.css'

interface LocationListItemProps {
  location: Location;
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (id: number) => void;
}

export const LocationListItem: React.FC<LocationListItemProps> = ({
  location,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="category-item-row">
      <div className="category-info-group">
        {/* Location Cover Image or Fallback */}
        {location.cover_image ? (
          <img
            src={
              location.cover_image.startsWith("http")
                ? location.cover_image
                : `http://localhost:8000${location.cover_image}`
            }
            alt={location.name}
            className="category-icon-img"
          />
        ) : (
          <div className="category-icon-placeholder">📍</div>
        )}
        
        <div className="category-text-details">
          <h4 className="category-item-name">{location.name}</h4>
          {location.city && <span className="category-item-city"> • {location.city}</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="category-actions">
        <button
          onClick={() => onView(location)}
          className="btn-action btn-view"
          title="View Location"
        >
          View
        </button>
        <button
          onClick={() => onEdit(location)}
          className="btn-action btn-edit"
          title="Edit Location"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(location.id)}
          className="btn-action btn-delete"
          title="Delete Location"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default LocationListItem;