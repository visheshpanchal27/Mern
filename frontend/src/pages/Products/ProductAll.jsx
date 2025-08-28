import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get all product images
  const allImages = useMemo(() => {
    const images = [];
    if (product.image) {
      const mainImageUrl = product.image.startsWith('http')
        ? product.image
        : `${import.meta.env.VITE_API_URL}${product.image}`;
      images.push(mainImageUrl);
    }
    if (product.images?.length) {
      const additionalImages = product.images.map(img => 
        img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    return images;
  }, [product.image, product.images]);

  // Random image cycling on page refresh/reload (unique per product)
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Use product ID to create unique seed for each product
      const seed = parseInt(product._id.slice(-4), 16) || Math.floor(Math.random() * 1000);
      const randomIndex = Math.floor((seed + Date.now() + refreshKey) % allImages.length);
      setCurrentImageIndex(randomIndex);
    }
  }, [allImages.length, refreshKey, product?._id]);

  // Auto-cycle images with unique timing per product
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Different interval for each product based on ID
      const baseInterval = 3000;
      const productOffset = (parseInt(product._id.slice(-2), 16) % 1000) || 0;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      }, baseInterval + productOffset);
      return () => clearInterval(interval);
    }
  }, [allImages.length, product?._id]);

  // Listen for page refresh/reload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && allImages.length > 1) {
        const randomIndex = Math.floor(Math.random() * allImages.length);
        setCurrentImageIndex(randomIndex);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [allImages.length]);

  const currentImage = allImages[currentImageIndex] || allImages[0];

  return (
    <div className="w-full max-w-sm mx-auto p-3 relative transition duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] hover:shadow-2xl transition-all duration-500 border border-gray-800 hover:border-pink-500/30">
        
        {/* Image Section */}
        <div className="relative w-full h-[18rem] overflow-hidden rounded-t-2xl group">
          <img
            src={currentImage}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition duration-700"
            loading="lazy"
          />
          
          {/* Image indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-pink-500' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{allImages.length}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Heart Icon */}
          <div className="absolute top-4 right-4 z-10">
            <HeartIcon product={product} />
          </div>

          {/* Quick view button */}
          <Link 
            to={`/product/${product._id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              Quick View
            </button>
          </Link>
          
          {/* Manual refresh button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setRefreshKey(prev => prev + 1);
              }}
              className="absolute top-2 right-12 bg-black/70 hover:bg-pink-600/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              title="Shuffle Images"
            >
              🎲
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-lg font-bold text-white hover:text-pink-400 transition truncate">
              {product.name}
            </h2>
          </Link>

          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {product.description?.substring(0, 80)}...
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-pink-400">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-gray-300 text-sm">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
