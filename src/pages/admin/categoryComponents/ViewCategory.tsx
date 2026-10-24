import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Category } from "../../../types/category";
import { categoryService } from "../../../services/categoryService";

export const ViewCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategoryById(Number(id));
        setCategory(data);
      } catch (err: any) {
        console.error("Failed to fetch category:", err);
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load category details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading category details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert-error">{error}</div>
        <button
          onClick={() => navigate("/admin/categories")}
          className="btn btn-secondary"
        >
          ← Back to Categories
        </button>
      </div>
    );
  }

  if (!category) return null;

  // Format image URL properly if it's a relative path
  const iconImageUrl = category.icon_url
    ? category.icon_url.startsWith("http")
      ? category.icon_url
      : `http://localhost:8000${category.icon_url}`
    : null;

  return (
    <div className="view-category-container">
      {/* Header bar */}
      <div className="view-header">
        <div>
          <h2>Category Details</h2>
          <p>Viewing information for ID: {category.id}</p>
        </div>
        <div className="view-actions">
          <button
            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
            className="btn btn-primary"
          >
            Edit Category
          </button>
          <button
            onClick={() => navigate("/admin/categories")}
            className="btn btn-secondary"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="category-details-card">
        {/* Icon / Image Section */}
        <div className="detail-row image-row">
          <span className="detail-label">Icon / Image:</span>
          <div className="detail-value">
            {iconImageUrl ? (
              <img
                src={iconImageUrl}
                alt={category.name}
                className="detail-category-img"
              />
            ) : (
              <span className="no-image-text">No image uploaded</span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value font-semibold">{category.name}</span>
        </div>

        {/* Slug */}
        <div className="detail-row">
          <span className="detail-label">Slug:</span>
          <span className="detail-value text-muted">/{category.slug}</span>
        </div>

        {/* Description */}
        <div className="detail-row">
          <span className="detail-label">Description:</span>
          <span className="detail-value">
            {category.description || (
              <span className="text-italic">No description provided</span>
            )}
          </span>
        </div>

        {/* Display Order */}
        <div className="detail-row">
          <span className="detail-label">Display Order:</span>
          <span className="detail-value">{category.display_order}</span>
        </div>

        {/* Status */}
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value">
            <span
              className={`status-badge ${
                category.is_active ? "active" : "inactive"
              }`}
            >
              {category.is_active ? "Active" : "Inactive"}
            </span>
          </span>
        </div>

        {/* Timestamps */}
        <div className="detail-row">
          <span className="detail-label">Created At:</span>
          <span className="detail-value">
            {new Date(category.created_at).toLocaleString()}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Updated At:</span>
          <span className="detail-value">
            {new Date(category.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;