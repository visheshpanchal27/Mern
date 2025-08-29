import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearchProductsQuery } from '../redux/api/productApiSlice';

const SearchBar = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const searchRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useSearchProductsQuery(debouncedTerm, {
    skip: debouncedTerm.length < 2
  });

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length >= 2);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : searchResults?.length > 0 ? (
            <>
              <div className="p-2 text-xs text-gray-400 border-b border-gray-600">
                {searchResults.length} results found
              </div>
              {searchResults.slice(0, 8).map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center p-3 hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={product.image?.startsWith('http') 
                      ? product.image 
                      : `${import.meta.env.VITE_API_URL}${product.image}`}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium truncate">
                      {product.name}
                    </h4>
                    <p className="text-pink-400 text-sm">${product.price}</p>
                  </div>
                </Link>
              ))}
              {searchResults.length > 8 && (
                <Link
                  to={`/shop?search=${searchTerm}`}
                  onClick={() => setShowResults(false)}
                  className="block p-3 text-center text-pink-400 hover:bg-gray-700 border-t border-gray-600"
                >
                  View all {searchResults.length} results
                </Link>
              )}
            </>
          ) : debouncedTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              No products found for "{debouncedTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;