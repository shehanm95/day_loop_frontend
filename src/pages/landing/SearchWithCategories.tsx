import React, { useState, type ChangeEvent, type KeyboardEvent } from 'react';

export interface Category {
  id: number;
  name: string;
}

// Component Props interface
interface SearchWithCategoriesProps {
  categories: Category[];
  onSearchChange: (searchQuery: string, selectedCategoryIds: number[]) => void;
  placeholder?: string;
}

export const SearchWithCategories: React.FC<SearchWithCategoriesProps> = ({
  categories,
  onSearchChange,
  placeholder = 'Search locations...',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryIds, setSelectedCategoryIds]  = useState<number[]>([]);

  // Handle text input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Real-time callback trigger (optional)
    onSearchChange(value, selectedCategoryIds);
  };

  // Handle search on Enter or button click
  const handleSearchSubmit = () => {
    onSearchChange(searchQuery, selectedCategoryIds);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Handle individual category toggle
  const handleCategoryToggle = (categoryId: number) => {
    let updatedIds: number[];
    if (selectedCategoryIds.includes(categoryId)) {
      updatedIds = selectedCategoryIds.filter((id) => id !== categoryId);
    } else {
      updatedIds = [...selectedCategoryIds, categoryId];
    }
    
    setSelectedCategoryIds(updatedIds);
    onSearchChange(searchQuery, updatedIds); // Notify parent instantly
  };

  // Handle "Select All" / "Deselect All" button
  const handleSelectAllToggle = () => {
    let updatedIds: number[];
    if (selectedCategoryIds.length === categories.length) {
      // If all are selected, deselect all
      updatedIds = [];
    } else {
      // Otherwise, select all category IDs
      updatedIds = categories.map((cat) => cat.id);
    }

    setSelectedCategoryIds(updatedIds);
    onSearchChange(searchQuery, updatedIds);
  };

  const isAllSelected = categories.length > 0 && selectedCategoryIds.length === categories.length;

  return (
    <div className="search-categories-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
      
      {/* Search Bar Section */}
      <div className="search-bar-wrapper" style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ flex: 1, padding: '10px 14px', fontSize: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button
          type="button"
          className="btn btn-primary search-btn"
          onClick={handleSearchSubmit}
          style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff' }}
        >
          Search
        </button>
      </div>

      {/* Category List & Select All Section */}
      <div className="categories-filter-section" style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>Filter by Categories:</span>
          
          {/* Select All / Deselect All Button */}
          <button
            type="button"
            onClick={handleSelectAllToggle}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Individual Checkbox List */}
        <div className="categories-chips-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map((cat) => {
            const isChecked = selectedCategoryIds.includes(cat.id);
            return (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: isChecked ? '#eff6ff' : '#ffffff',
                  border: `1px solid ${isChecked ? '#bfdbfe' : '#cbd5e1'}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  userSelect: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat.id)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: isChecked ? '#1d4ed8' : '#1e293b' }}>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default SearchWithCategories;