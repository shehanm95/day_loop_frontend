import React, { useState } from 'react';
import { LocationSearchPage } from './LocationSearchPage';
import LocationListLanding from './LocationListLanding';

export const LocationListDisplayLanding: React.FC = () => {
  // State to manage search query and selected categories
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Handle search parameter changes from the search child component
  const handleSearchChange = (query: string, categoryIds: number[]) => {
    setSearchQuery(query);
    setSelectedCategoryIds(categoryIds);
  };

  return (
    <>
      {/* Pass the search handler callback to retrieve inputs */}
      <LocationSearchPage onSearchChange={handleSearchChange} />
      
      {/* Pass down search query and categories to filter the location list */}
      <LocationListLanding 
        searchQuery={searchQuery} 
        categoryIds={selectedCategoryIds} 
      />
    </>
  );
};

export default LocationListDisplayLanding;