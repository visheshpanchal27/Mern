import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  if (isLoading || !product) {
    return (
      <div className="w-[16rem] p-3 hidden sm:block animate-pulse">
        <div className="bg-gray-800 rounded-xl p-2 h-36 flex items-center justify-center">
          <div className="h-32 w-32 bg-gray-700 rounded-lg" />
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-gray-700 rounded-md"></div>
            <div className="h-4 w-10 bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[16rem] p-3 hidden sm:block">
      <div className="relative bg-white rounded-xl p-2 group">
        <img
          src={allImages[currentImageIndex] || allImages[0]}
          alt={product.name}
          className="h-32 w-auto mx-auto object-contain transition-all duration-300"
          onMouseEnter={() => {
            if (allImages.length > 1) {
              setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }
          }}
          onMouseLeave={() => setCurrentImageIndex(0)}
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {currentImageIndex + 1}/{allImages.length}
          </div>
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
