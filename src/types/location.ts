// Location Image Response Type
export interface LocationImageResponse {
  id: number;
  image_url: string;
  caption?: string | null;
}

// Category Nested Response Type
export interface CategoryResponseNested {
  id: number;
  name: string;
  slug: string;
  icon_url?: string | null;
}

// Base Location Attributes
export interface LocationBase {
  name: string;
  slug: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  province: string;
  opening_time?: string | null;
  closing_time?: string | null;
  average_visit_duration?: number | null;
  entry_fee_local: number;
  entry_fee_foreign: number;
  contact_number?: string | null;
  website?: string | null;
  is_active: boolean;
}

// Location Create Payload Interface
// NOTE: When creating, category_ids should be sent as a comma-separated string (e.g., '1,2') 
// if you are using FormData, or an array of numbers if sending raw JSON.
export interface LocationCreatePayload {
  name: string;
  slug: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  province: string;
  opening_time?: string;
  closing_time?: string;
  average_visit_duration?: number;
  entry_fee_local?: number;
  entry_fee_foreign?: number;
  contact_number?: string;
  website?: string;
  category_ids: string; // Comma-separated IDs string for FormData
  cover_image?: File | null;
  gallery_files?: File[];
}

// Location Update Payload Interface
export interface LocationUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  district?: string;
  province?: string;
  opening_time?: string;
  closing_time?: string;
  average_visit_duration?: number;
  entry_fee_local?: number;
  entry_fee_foreign?: number;
  rating?: number;
  contact_number?: string;
  website?: string;
  is_active?: boolean;
  category_ids?: string; // Comma-separated IDs string for FormData
  cover_image?: File | null;
  gallery_files?: File[];
}

// Full Location Response Interface (matches backend LocationResponse)
export interface LocationResponse extends LocationBase {
  id: number;
  rating: number;
  cover_image?: string | null;
  categories: CategoryResponseNested[];
  gallery_images: LocationImageResponse[];
}

// Query parameters interface for fetching locations with filters
export interface LocationQueryParams {
  category?: string;
  district?: string;
  city?: string;
  search?: string;
  skip?: number;
  limit?: number;
}