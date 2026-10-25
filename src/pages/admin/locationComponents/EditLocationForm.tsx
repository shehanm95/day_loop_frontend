import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { LocationResponse, LocationUpdatePayload } from '../../../types/location';
import type { Category } from '../../../types/category';
import { locationService } from '../../../services/locationService';
import LocationSelector, { type LocationCoordinates } from './LocationSelector';
import './CreateLocationForm.css'; // Using the exact same CSS
import { categoryService } from '../../../services/categoryService';
import ReactQuill from 'react-quill-new';

export const EditLocationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationId = id ? parseInt(id, 10) : 0;

  // State for form input fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    latitude: 6.9271,
    longitude: 79.8612,
    address: '',
    city: '',
    district: '',
    province: '',
    opening_time: '',
    closing_time: '',
    average_visit_duration: 1.5,
    entry_fee_local: 0.0,
    entry_fee_foreign: 0.0,
    contact_number: '',
    website: '',
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Existing images from backend (URLs or paths)
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  // New image files state for updates
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // UI status states
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch categories and location data on mount
useEffect(() => {
    const loadInitialData = async () => {
      try {
        setFetchingData(true);
        // 1. Fetch categories
        const categoriesData = await categoryService.getCategories(0, 100, true);
        setCategories(categoriesData);

        // 2. Fetch location details by ID
        if (locationId) {
          const locationData: LocationResponse = await locationService.getLocationById(locationId);
          
          setFormData({
            name: locationData.name || '',
            slug: locationData.slug || '',
            description: locationData.description || '',
            latitude: locationData.latitude || 6.9271,
            longitude: locationData.longitude || 79.8612,
            address: locationData.address || '',
            city: locationData.city || '',
            district: locationData.district || '',
            province: locationData.province || '',
            opening_time: locationData.opening_time || '',
            closing_time: locationData.closing_time || '',
            average_visit_duration: locationData.average_visit_duration || 1.5,
            entry_fee_local: locationData.entry_fee_local || 0.0,
            entry_fee_foreign: locationData.entry_fee_foreign || 0.0,
            contact_number: locationData.contact_number || '',
            website: locationData.website || '',
          });

          // Set existing categories if available
          if (locationData.categories) {
            setSelectedCategoryIds(locationData.categories.map((cat) => cat.id));
          }

          // Set existing cover image URL
          if (locationData.cover_image) {
            setExistingCoverUrl(locationData.cover_image);
          }

          // Set existing gallery image URLs from LocationImageResponse[] array
          if (locationData.gallery_images && Array.isArray(locationData.gallery_images)) {
            setExistingGalleryUrls(locationData.gallery_images.map((img) => img.image_url));
          }
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
        setError('Failed to load location details for editing.');
      } finally {
        setFetchingData(false);
      }
    };

    loadInitialData();
  }, [locationId]);

  // Handle standard text and number inputs change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle category checkbox selection changes
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle Form Submission for Update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one category.');
      return;
    }

    try {
      setLoading(true);
      const categoryIdsString = selectedCategoryIds.join(',');

      const payload: LocationUpdatePayload = {
        ...formData,
        category_ids: categoryIdsString,
        cover_image: coverImage,
        gallery_files: galleryFiles,
      };

      await locationService.updateLocation(locationId, payload);
      setSuccessMessage('Location updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while updating the location.');
    } finally {
      setLoading(false);
    }
  };

  const locationSelectorFunc = (selectedLocation: LocationCoordinates) => {
    setFormData((prev) => ({
      ...prev,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    }));
  };

  // Handle single cover image file selection
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
      setExistingCoverUrl(null); // Clear old cover preview when new one is chosen
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setExistingCoverUrl(null);
  };

  // Handle multiple gallery image files selection
  const handleGalleryFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveNewGalleryImage = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingGalleryImage = (indexToRemove: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Helper function to format image URL correctly
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:8000${url}`;
  };

  if (fetchingData) {
    return <div className="location-form-container"><p>Loading location details...</p></div>;
  }

  return (
    <div className="location-form-container">
      <div className="location-form-header">
        <h2>Edit Location</h2>
      </div>
      
      {error && <div className="form-alert-error">{error}</div>}
      {successMessage && <div className="form-alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="location-form">
        {/* Basic Information Section */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Location Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Slug:</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
          </div>

          {/* Description Field using Rich Text Editor */}
            <div className="form-group full-width">
              <label>Description:</label>
              <ReactQuill 
                theme="snow"
                value={formData.description || ''}
                onChange={(content) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: content,
                  }));
                }}
                placeholder="Write a detailed description about the location..."
                style={{ background: '#fff', borderRadius: '4px', minHeight: '150px', marginBottom: '40px' }}
              />
            </div>
        </div>

        {/* Location Coordinates & Manual / Map Section */}
        <div className="form-section">
          <h3>Location & Coordinates (Google Maps / Manual Entry)</h3>
          <p className="section-description">You can enter coordinates manually or use Google Maps search/links to find exact coordinates.</p>
          <LocationSelector onLocationSelect={locationSelectorFunc}></LocationSelector>
          <div className="form-row">
            <div className="form-group">
              <label>Latitude:</label>
              <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Longitude:</label>
              <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City:</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>District:</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Province:</label>
              <input type="text" name="province" value={formData.province} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Operational Details */}
        <div className="form-section">
          <h3>Operational & Visit Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Opening Time:</label>
              <input type="text" name="opening_time" placeholder="08:30 AM" value={formData.opening_time || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Closing Time:</label>
              <input type="text" name="closing_time" placeholder="05:00 PM" value={formData.closing_time || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Average Visit Duration (Hours):</label>
              <input type="number" step="0.1" name="average_visit_duration" value={formData.average_visit_duration || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Fee (Local):</label>
              <input type="number" step="0.01" name="entry_fee_local" value={formData.entry_fee_local} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Entry Fee (Foreign):</label>
              <input type="number" step="0.01" name="entry_fee_foreign" value={formData.entry_fee_foreign} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Number:</label>
              <input type="text" name="contact_number" value={formData.contact_number || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Website:</label>
              <input type="text" name="website" value={formData.website || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="form-section">
          <h3>Select Categories</h3>
          {categories.length === 0 ? (
            <p className="section-description">Loading categories...</p>
          ) : (
            <div className="categories-grid">
              {categories.map((cat) => (
                <label key={cat.id} className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Image Upload & Management Fields */}
        <div className="form-section">
          <h3>Images Upload & Management</h3>
          
          <div className="form-row">
            {/* Cover Image Upload & Existing View */}
            <div className="form-group file-upload-group">
              <label>Cover Image:</label>
              <input className="file-input" type="file" accept="image/*" onChange={handleCoverImageChange} />
              
              {/* Show newly selected cover file preview */}
              {coverImage && (
                <div className="cover-preview-container">
                  <img 
                    src={URL.createObjectURL(coverImage)} 
                    alt="New Cover Preview" 
                    className="cover-preview-img" 
                  />
                  <button 
                    type="button" 
                    className="remove-img-btn" 
                    onClick={handleRemoveCoverImage}
                  >
                    × Remove Cover
                  </button>
                </div>
              )}

              {/* Show existing cover image from server if no new one selected */}
              {!coverImage && existingCoverUrl && (
                <div className="cover-preview-container">
                  <img 
                    src={getImageUrl(existingCoverUrl)} 
                    alt="Existing Cover" 
                    className="cover-preview-img" 
                  />
                  <button 
                    type="button" 
                    className="remove-img-btn" 
                    onClick={handleRemoveCoverImage}
                  >
                    × Remove Cover
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Images Upload & Existing View */}
            <div className="form-group file-upload-group">
              <label>Gallery Images:</label>
              <input className="file-input" type="file" accept="image/*" multiple onChange={handleGalleryFilesChange} />
              
              <div className="gallery-preview-grid">
                {/* Existing Gallery Images from Server */}
                {existingGalleryUrls.map((url, index) => (
                  <div key={`existing-${index}`} className="gallery-thumbnail-wrapper">
                    <img 
                      src={getImageUrl(url)} 
                      alt={`Existing gallery ${index + 1}`} 
                      className="gallery-thumbnail-img" 
                    />
                    <button 
                      type="button" 
                      className="remove-thumbnail-btn" 
                      onClick={() => handleRemoveExistingGalleryImage(index)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Newly Added Gallery Files Preview */}
                {galleryFiles.map((file, index) => (
                  <div key={`new-${index}`} className="gallery-thumbnail-wrapper">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New gallery preview ${index + 1}`} 
                      className="gallery-thumbnail-img" 
                    />
                    <button 
                      type="button" 
                      className="remove-thumbnail-btn" 
                      onClick={() => handleRemoveNewGalleryImage(index)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating Location...' : 'Update Location'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLocationForm;