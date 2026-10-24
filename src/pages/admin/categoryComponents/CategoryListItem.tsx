import React from "react";
import type { Category } from "../../../types/category";

interface CategoryListItemProps {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="category-item-row">
      <div className="category-info-group">
        {/* Category Icon or Fallback */}
        {category.icon_url ? (
          <img
            src={
                category.icon_url.startsWith("http")
                ? category.icon_url
                : `http://localhost:8000${category.icon_url}`
            }
            alt={category.name}
            className="category-icon-img"
            />
        ) : (
          <div className="category-icon-placeholder">📁</div>
        )}
        
        <div className="category-text-details">
          <h4 className="category-item-name">{category.name}</h4>
          <span className="category-item-slug">/{category.slug}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="category-actions">
        <button
          onClick={() => onView(category)}
          className="btn-action btn-view"
          title="View Category"
        >
          View
        </button>
        <button
          onClick={() => onEdit(category)}
          className="btn-action btn-edit"
          title="Edit Category"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="btn-action btn-delete"
          title="Delete Category"
        >
          Delete
        </button>
      </div>
    </div>
  );
};