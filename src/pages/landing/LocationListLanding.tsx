import React, { useState, useEffect } from 'react';
import { LocationCardLanding } from './LocationCardLanding';
import type { LocationResponse } from '../../types/location';
import { locationService } from '../../services/locationService';
import { useNavigate } from 'react-router-dom';

interface LocationListLandingProps {
  searchQuery: string;
  categoryIds: number[];
}

export const LocationListLanding: React.FC<LocationListLandingProps> = ({ searchQuery, categoryIds }) => {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params based on search text and category filters
        const params: any = {};
        if (searchQuery) {
          params.search = searchQuery;
        }
        if (categoryIds && categoryIds.length > 0) {
          params.category_ids = categoryIds.join(',');
        }

        // Fetch locations using query parameters
        const data = await locationService.getLocations(params);
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations', err);
        setError('Failed to load locations.');
      } finally {
        setLoading(false);
      }
    };

    // Add a small debounce or direct call when filters change
    fetchLocations();
  }, [searchQuery, categoryIds]);

  const handleView = (id: number) => {
    navigate("/view/" + id.toString())
  };

  const handleAddToRoute = (location: LocationResponse) => {
    console.log('Added to route:', location.name);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading locations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {locations.map((loc) => (
            <LocationCardLanding
              key={loc.id}
              location={loc}
              onView={handleView}
              onAddToRoute={handleAddToRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationListLanding;