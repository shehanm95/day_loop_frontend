import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryListItem } from "./CategoryListItem"; // Make sure path is correct
import type { Category } from "../../../types/category";
import { categoryService } from "../../../services/categoryService";
import "./categorylist.css";

export const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch categories using categoryService when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        // Calling the service method we created
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error("Failed to load categories:", err); 
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddNew = () => {
    navigate("/admin/categories/create"); // Navigate to create category page
  };

  const handleView = (category: Category) => {
    console.log("View category:", category);
    navigate(`/admin/categories/view/${category.id}`);
  };

  const handleEdit = (category: Category) => {
    console.log("Edit category:", category);
    navigate(`/admin/categories/edit/${category.id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.deleteCategory(id);
        // Remove deleted category from local state
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } catch (err: any) {
        console.error("Failed to delete category:", err);
        alert(err.response?.data?.detail || "Failed to delete category.");
      }
    }
  };

  return (
    <div className="category-management-container">
      {/* Top Bar: Title and Add New Button */}
      <div className="category-header-bar">
        <div>
          <h2 className="section-title">Categories</h2>
          <p className="section-subtitle">Manage product or location categories</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          + Add New Category
        </button>
      </div>

      {/* Error / Loading States */}
      {loading && <p className="loading-text">Loading categories...</p>}
      {error && <div className="alert-error">{error}</div>}

      {/* Category List Area */}
      <div className="category-list-wrapper">
        {!loading && !error && categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories found. Click "Add New Category" to create one.</p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryList;