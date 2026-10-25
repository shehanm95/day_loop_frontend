import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { LocationCreatePayload } from '../../../types/location';
import type { Category } from '../../../types/category';
import { locationService } from '../../../services/locationService';
import LocationSelector, { type LocationCoordinates } from './LocationSelector';
import './CreateLocationForm.css';
import { categoryService } from '../../../services/categoryService';
import ReactQuill from 'react-quill-new';

export const CreateLocationForm: React.FC = () => {
  // State for form input fields matching LocationCreatePayload
  const [formData, setFormData] = useState<Omit<LocationCreatePayload, 'category_ids' | 'cover_image' | 'gallery_files'>>({
    name: '',
    slug: '',
    description: '',
    latitude: 6.9271, // Default latitude (e.g., Colombo)
    longitude: 79.8612, // Default longitude
    address: '',
    city: '',
    district: 'Gampaha',
    province: 'Western',
    opening_time: '',
    closing_time: '',
    average_visit_duration: 1.5,
    entry_fee_local: 0.0,
    entry_fee_foreign: 0.0,
    contact_number: '',
    website: '',
  });

  // Categories state for fetching and selection
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Image files state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // UI status states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch categories on component mount using getCategories function provided
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace with your actual categoryService.getCategories call
        const data = await categoryService.getCategories(0, 100, true);
        
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

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

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation: ensure at least one category is selected
    if (selectedCategoryIds.length === 0) {
      setError('Please select at least one category.');
      return;
    }

    try {
      setLoading(true);

      // Backend expects category_ids as a comma-separated string for FormData (e.g., '1,2')
      const categoryIdsString = selectedCategoryIds.join(',');

      const payload: LocationCreatePayload = {
        ...formData,
        category_ids: categoryIdsString,
        cover_image: coverImage,
        gallery_files: galleryFiles,
      };

      // Call service method to create location (sends multipart/form-data)
      await locationService.createLocation(payload);

      setSuccessMessage('Location created successfully!');
      // Reset form or redirect if needed
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while creating the location.');
    } finally {
      setLoading(false);
    }
  };

  const locationSelectorFunc = (selectedLocation: LocationCoordinates) => {
    console.log(selectedLocation);
    
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
    }
  };

  // Handle removing cover image
  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  // Handle multiple gallery image files selection (appending or replacing based on choice)
  const handleGalleryFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle removing a specific gallery image by index
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="location-form-container">
     
      <div className="location-form-header">
        <h2>Create New Location</h2>
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
              <input type="time" name="opening_time" placeholder="08:30 AM" value={formData.opening_time || ''} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Closing Time:</label>
              <input type="time" name="closing_time" placeholder="05:00 PM" value={formData.closing_time || ''} onChange={handleChange} />
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

        {/* Image Upload Fields */}
        <div className="form-section">
          <h3>Images Upload</h3>
          
          <div className="form-row">
            {/* Cover Image Upload */}
            <div className="form-group file-upload-group">
              <label>Cover Image (Single File):</label>
              <input className="file-input" type="file" accept="image/*" onChange={handleCoverImageChange} />
              
              {coverImage && (
                <div className="cover-preview-container">
                  <img 
                    src={URL.createObjectURL(coverImage)} 
                    alt="Cover Preview" 
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

            {/* Gallery Images Upload */}
            <div className="form-group file-upload-group">
              <label>Gallery Images (Multiple Files):</label>
              <input className="file-input" type="file" accept="image/*" multiple onChange={handleGalleryFilesChange} />
              
              {galleryFiles.length > 0 && (
                <div className="gallery-preview-grid">
                  {galleryFiles.map((file, index) => (
                    <div key={index} className="gallery-thumbnail-wrapper">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Gallery preview ${index + 1}`} 
                        className="gallery-thumbnail-img" 
                      />
                      <button 
                        type="button" 
                        className="remove-thumbnail-btn" 
                        onClick={() => handleRemoveGalleryImage(index)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Location...' : 'Create Location'}
          </button>
        </div>
      </form>
    </div>
  );
};