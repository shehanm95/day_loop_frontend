import type { LocationCreatePayload, LocationQueryParams, LocationResponse, LocationUpdatePayload } from "../types/location";
import { apiClient } from "./api";

export const locationService = {
  // Get all locations with optional query filters
  async getLocations(params?: LocationQueryParams): Promise<LocationResponse[]> {
    const response = await apiClient.get<LocationResponse[]>('/api/v1/locations/', { params });
    return response.data;
  },

  // Get nearby locations based on lat, lon, and radius
  async getNearbyLocations(lat: number, lon: number, radiusKm: number = 25.0): Promise<LocationResponse[]> {
    const response = await apiClient.get<LocationResponse[]>('/api/v1/locations/nearby', {
      params: { lat, lon, radius_km: radiusKm }
    });
    return response.data;
  },

  // Get location by ID
  async getLocationById(locationId: number): Promise<LocationResponse> {
    const response = await apiClient.get<LocationResponse>(`/api/v1/locations/${locationId}`);
    return response.data;
  },

  // Get locations by name search
  async getLocationsByName(locationName: string): Promise<LocationResponse[]> {
    const response = await apiClient.get<LocationResponse[]>(`/api/v1/locations/name/${locationName}`);
    return response.data;
  },

  /**
   * CREATE LOCATION
   * NOTE: This function accepts form fields, category IDs string, a cover image file, 
   * and multiple gallery image files, packing them into a FormData object for multipart/form-data upload.
   */
  async createLocation(payload: LocationCreatePayload): Promise<LocationResponse> {
    const formData = new FormData();

    // Append all standard scalar fields
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'cover_image' && key !== 'gallery_files') {
        formData.append(key, String(value));
      }
    });

    // Append single cover image file if provided
    if (payload.cover_image) {
      formData.append('cover_image', payload.cover_image);
    }

    // Append multiple gallery image files if provided
    if (payload.gallery_files && payload.gallery_files.length > 0) {
      payload.gallery_files.forEach((file) => {
        formData.append('gallery_files', file);
      });
    }

    const response = await apiClient.post<LocationResponse>('/api/v1/locations/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * UPDATE LOCATION
   * NOTE: This function accepts optional form fields, category IDs string, and image files (cover & gallery), 
   * formatting them into a FormData object for multipart/form-data requests.
   */
  async updateLocation(locationId: number, payload: LocationUpdatePayload): Promise<LocationResponse> {
    const formData = new FormData();

    // Append fields only if they are defined
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'cover_image' && key !== 'gallery_files') {
        formData.append(key, String(value));
      }
    });

    // Append cover image if provided
    if (payload.cover_image) {
      formData.append('cover_image', payload.cover_image);
    }

    // Append gallery files if provided
    if (payload.gallery_files && payload.gallery_files.length > 0) {
      payload.gallery_files.forEach((file) => {
        formData.append('gallery_files', file);
      });
    }

    const response = await apiClient.put<LocationResponse>(`/api/v1/locations/${locationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Delete location (supports soft delete by default)
  async deleteLocation(locationId: number, softDelete: boolean = true): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/v1/locations/${locationId}`, {
      params: { soft_delete: softDelete }
    });
    return response.data;
  }
};