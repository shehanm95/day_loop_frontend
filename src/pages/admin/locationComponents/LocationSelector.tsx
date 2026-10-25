import React, { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './LocationSelector.css';

// Fix for default Leaflet marker icons in React (using CDN URLs)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PlaceSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationCoordinates {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationCoordinates) => void;
}

interface MapViewUpdaterProps {
  center: [number, number];
  zoom: number;
}

// Advanced concept: Custom hook usage to imperatively control map view panning/zooming
const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

interface ClickHandlerProps {
  onMapClick: (lat: number, lon: number) => void;
}

const MapClickHandler: React.FC<ClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const GAMPAHA_CENTER: [number, number] = [7.0840, 79.9930];
  const DEFAULT_ZOOM = 11;

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(GAMPAHA_CENTER);
  const [zoomLevel, setZoomLevel] = useState<number>(DEFAULT_ZOOM);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  // Search location using OpenStreetMap Nominatim API (Triggered via button click or Enter key)
  const handleSearch = async (): Promise<void> => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }

      const data: PlaceSearchResult[] = await response.json();
      setResults(data);
    } catch (err) {
      setError('An error occurred while fetching locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectPlace = (place: PlaceSearchResult): void => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const locationData: LocationCoordinates = {
      name: place.display_name,
      latitude: lat,
      longitude: lon,
    };

    setSelectedLocation(locationData);
    setMapCenter([lat, lon]);
    setZoomLevel(15);
    setResults([]);
    
    onLocationSelect(locationData);
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const placeName = data.display_name || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

      const locationData: LocationCoordinates = {
        name: placeName,
        latitude: lat,
        longitude: lon,
      };

      setSelectedLocation(locationData);
      setMapCenter([lat, lon]);
      onLocationSelect(locationData);
    } catch (err) {
      const locationData: LocationCoordinates = {
        name: `Selected Point (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
        latitude: lat,
        longitude: lon,
      };
      setSelectedLocation(locationData);
      setMapCenter([lat, lon]);
      onLocationSelect(locationData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-selector-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Search Input and Button Container (Form removed) */}
      <div className="search-bar-wrapper" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search location in Gampaha..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button
          type="button"
          className="btn btn-primary search-button"
          onClick={handleSearch}
          disabled={isLoading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <ul className="results-list" style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', background: '#fff', position: 'absolute', zIndex: 1000, width: '100%' }}>
          {results.map((place) => (
            <li key={place.place_id} className="results-item">
              <button
                type="button"
                className="results-button"
                onClick={() => handleSelectPlace(place)}
                style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'none', border: 'none', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              >
                {place.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="map-container" style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <MapContainer
          center={GAMPAHA_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <MapViewUpdater center={mapCenter} zoom={zoomLevel} />
          <MapClickHandler onMapClick={handleMapClick} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedLocation && (
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
              <Popup>
                <strong>{selectedLocation.name}</strong>
                <br />
                Lat: {selectedLocation.latitude}, Lon: {selectedLocation.longitude}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="details-card" style={{ marginTop: '15px', padding: '15px', background: '#f9f9f9', borderRadius: '6px' }}>
          <h3 className="details-title" style={{ margin: '0 0 10px 0' }}>Selected Location Details</h3>
          <p className="details-info"><strong>Name:</strong> {selectedLocation.name}</p>
          <p className="details-info"><strong>Latitude:</strong> {selectedLocation.latitude}</p>
          <p className="details-info"><strong>Longitude:</strong> {selectedLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;