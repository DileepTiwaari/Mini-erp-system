// src/components/common/SearchBar.jsx
// Reusable input form wrapper with search and filter attributes.
// Integrates an inline search icon.

import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative rounded-md shadow-sm max-w-xs w-full ${className}`}>
      {/* Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      {/* Input */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
