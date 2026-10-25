import React, { useState, useEffect } from "react";
import SearchWithCategories from "./SearchWithCategories";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";

interface LocationSearchPageProps {
  onSearchChange: (query: string, categoryIds: number[]) => void;
}

export const LocationSearchPage: React.FC<LocationSearchPageProps> = ({ onSearchChange }) => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Fetch active categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // Fetching active categories using the category service
        const categories = await categoryService.getCategories(0, 100, true);
        setAvailableCategories(categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (query: string, categoryIds: number[]) => {
    // Propagate search parameters up to the parent (Home)
    onSearchChange(query, categoryIds);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Explore Locations</h2>
      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <SearchWithCategories 
          categories={availableCategories} 
          onSearchChange={handleSearchChange} 
          placeholder="Search by location name..."
        />
      )}
    </div>
  );
};