import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CategoryCreate } from "../../../types/category";
import { categoryService } from "../../../services/categoryService";

export const CreateCategory: React.FC = () => {
  const navigate = useNavigate();

  // Form state matching CategoryCreate fields
  const [formData, setFormData] = useState<CategoryCreate>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    display_order: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name if user hasn't manually edited slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    const generatedSlug = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      name: nameValue,
      slug: generatedSlug,
    }));
  };

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
    setError(null);
    setLoading(true);

    try {
      // Calls the service method which uses FormData internally for file upload
      await categoryService.createCategory(formData, selectedFile || undefined);
      navigate("/admin/categories"); // Redirect back to categories list upon success
    } catch (err: any) {
      console.error("Failed to create category:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to create category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-category-container">
      <div className="form-header">
        <h2>Add New Category</h2>
        <p>Create a new category for your items or locations</p>
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
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. Restaurants"
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
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g. restaurants"
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
            placeholder="Optional category description..."
            className="form-textarea"
          />
        </div>

        {/* Display Order */}
        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input
            type="number"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Icon / Image Upload */}
        <div className="form-group">
          <label className="form-label">Category Icon / Image</label>
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
              checked={formData.is_active}
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
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;