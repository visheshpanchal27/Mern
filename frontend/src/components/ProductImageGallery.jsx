import { useState, useMemo } from "react";
import { ImageGallerySkeleton } from "./Skeletons";
import { useSwipe } from "../hooks/useSwipe";

const ProductImageGallery = ({ 
  product, 
  className = "", 
  showThumbnails = true, 
  onImageClick = null,
  isLoading = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Get all product images (main + additional)
  const allImages = useMemo(() => {
    if (!product) return [];
    
    const images = [];
    
    // Add main image
    if (product.image) {
      const mainImageUrl = product.image.startsWith("http")
        ? product.image
        : `${import.meta.env.VITE_API_URL}${product.image}`;
      images.push(mainImageUrl);
    }
    
    // Add additional images
    if (product.images?.length) {
      const additionalImages = product.images.map(img => 
        img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    
    return images;
  }, [product]);

  if (isLoading) return <ImageGallerySkeleton />;
  if (!allImages.length) return null;

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(allImages[selectedImage]);
    }
  };

  const swipeHandlers = useSwipe(
    () => setSelectedImage(prev => (prev + 1) % allImages.length), // Swipe left - next image
    () => setSelectedImage(prev => (prev - 1 + allImages.length) % allImages.length) // Swipe right - prev image
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative">
        <img
          src={allImages[selectedImage]}
          alt={product.name}
          onClick={handleImageClick}
          className="w-full max-h-[50rem] object-contain rounded cursor-zoom-in"
          {...swipeHandlers}
        />
        
        {/* Stock indicators */}
        {product.countInStock <= 5 && product.countInStock > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Only {product.countInStock} left!
          </div>
        )}
        {product.countInStock === 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {showThumbnails && allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {allImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                selectedImage === index ? "border-pink-500" : "border-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;