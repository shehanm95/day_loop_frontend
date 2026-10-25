import React from 'react';
import type { LocationResponse } from '../../types/location';

interface LocationCardProps {
  location: LocationResponse;
  onView: (id: number) => void;
  onAddToRoute: (location: LocationResponse) => void;
}

export const LocationCardLanding: React.FC<LocationCardProps> = ({
  location,
  onView,
  onAddToRoute,
}) => {
  // Image URL helper (localhost backend support)
  const getImageUrl = (url?: string | null) => {
    if (!url) return 'https://via.placeholder.com/400x200?text=No+Image'; // Fallback placeholder
    return url.startsWith('http') ? url : `http://localhost:8000${url}`;
  };
  console.log(location)
  return (
    <div className="location-card" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
      {/* Location Image */}
      <div style={{ height: '180px', width: '100%', overflow: 'hidden', background: '#f1f5f9' }}>
        <img
          src={getImageUrl(location.cover_image)}
          alt={location.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>{location.name}</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
            {location.city}, {location.district}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={() => onView(location.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onAddToRoute(location)}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Add to Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCardLanding;