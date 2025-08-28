import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import HeartIcon from "./HeartIcon";
import { SmallProductSkeleton } from "../../components/Skeletons";

const SmallProduct = ({ product, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get all product images
  const allImages = useMemo(() => {
    if (!product) return [];
    const images = [];
    if (product.image) {
      const mainImageUrl = product.image.startsWith("http")
        ? product.image
        : `${import.meta.env.VITE_API_URL}${product.image}`;
      images.push(mainImageUrl);
    }
    if (product.images?.length) {
      const additionalImages = product.images.map(img => 
        img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    return images;
  }, [product]);

  // Random image on page refresh/reload (unique per product)
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
      const baseInterval = 5000;
      const productOffset = (parseInt(product._id.slice(-2), 16) % 1500) || 0;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      }, baseInterval + productOffset);
      return () => clearInterval(interval);
    }
  }, [allImages.length, product?._id]);

  if (isLoading || !product) {
    return <SmallProductSkeleton />;
  }

  return (
    <div className="w-[16rem] p-3 hidden sm:block">
      <div className="relative bg-white rounded-xl p-2 group">
        <img
          src={allImages[currentImageIndex] || allImages[0]}
          alt={product.name}
          className="h-32 w-auto mx-auto object-contain transition-all duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
        {allImages.length > 1 && (
          <>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImageIndex + 1}/{allImages.length}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setRefreshKey(prev => prev + 1);
              }}
              className="absolute top-2 left-2 bg-black/70 hover:bg-pink-600/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              🎲
            </button>
          </>
        )}
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center text-white font-semibold text-sm hover:text-pink-400">
            <div className="truncate max-w-[8rem]">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2.5 py-0.5 rounded-xl">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
