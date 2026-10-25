import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CategoryCreate } from "../../../types/category";
import { categoryService } from "../../../services/categoryService";

export const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState< CategoryCreate >({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    display_order: 0,
  });

  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing category data on mount
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await categoryService.getCategoryById(Number(id));
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          is_active: data.is_active,
          display_order: data.display_order,
        });
        setCurrentIconUrl(data.icon_url || null);
      } catch (err: any) {
        console.error("Failed to fetch category:", err);
        setError("Failed to load category details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSubmitting(true);

    try {
      // 1. Update text fields and status/order
      await categoryService.updateCategoryPartial(Number(id), formData);

      // 2. If a new icon file is selected, upload it separately
      if (selectedFile) {
        await categoryService.uploadCategoryImage(Number(id), selectedFile);
      }

      navigate("/admin/categories");
    } catch (err: any) {
      console.error("Failed to update category:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to update category. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading category data...</p>
      </div>
    );
  }

  // Format existing image URL if present
  const iconPreviewUrl = currentIconUrl
    ? currentIconUrl.startsWith("http")
      ? currentIconUrl
      : `http://localhost:8000${currentIconUrl}`
    : null;

  return (
    <div className="edit-category-container">
      <div className="form-header">
        <h2>Edit Category</h2>
        <p>Update category information and icon</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="category-form">
        {/* Category Name */}
        <div className="form-group">
          <label className="form-label">Category Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug || ""}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description || ""}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        {/* Display Order */}
        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input
            type="number"
            name="display_order"
            value={formData.display_order ?? 0}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Current Icon Preview & File Upload */}
        <div className="form-group">
          <label className="form-label">Category Icon / Image</label>
          {iconPreviewUrl && (
            <div className="current-image-preview">
              <img
                src={iconPreviewUrl}
                alt="Current Icon"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <span className="text-sm text-muted">Current Icon</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-file-input"
          />
        </div>

        {/* Is Active Status Checkbox */}
        <div className="form-group-checkbox">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active ?? true}
              onChange={handleChange}
            />
            Active Status
          </label>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Saving..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;