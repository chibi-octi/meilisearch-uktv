import React, { useState, useEffect, useRef, useCallback } from 'react';

const SearchSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimer = useRef(null);
  const onSearchRef = useRef(onSearch);

  // Keep onSearch ref up to date
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounced search - triggers search 300ms after user stops typing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      if (onSearchRef.current) {
        onSearchRef.current(searchQuery.trim());
      }
    }, 300); // 300ms delay

    // Cleanup on unmount or when searchQuery changes
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear any pending debounced calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (onSearchRef.current) {
      onSearchRef.current(searchQuery.trim());
    }
  };

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SearchRefine</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              placeholder="Describe what you want to watch... (e.g., 'a crime show with a detective', 'something funny', 'drama set in Italy')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;

