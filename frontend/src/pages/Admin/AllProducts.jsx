import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import ProductImageGallery from "../../components/ProductImageGallery";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";

const AllProducts = () => {
  const { data: productsData, isLoading, isError } = useAllProductsQuery();
  const products = productsData?.products || [];

  if (isLoading) {
    return (
      <div className="text-white p-6 flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 p-6">Error loading products</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] relative">
      {/* Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-full w-20 bg-black flex-col items-center py-6 z-20">
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:ml-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Product Management
              </h1>
              <p className="text-gray-400">Manage all products ({products?.length || 0} total)</p>
            </div>
            <Link 
              to="/admin/productlist"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center gap-2 mt-4 md:mt-0"
            >
              <FaPlus /> New Product
            </Link>
          </div>

        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Card Component with Multiple Images
const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all images
  const allImages = [];
  if (product.image) {
    const mainImageUrl = product.image.startsWith("http")
      ? product.image
      : `${import.meta.env.VITE_API_URL}${product.image}`;
    allImages.push(mainImageUrl);
  }
  if (product.images?.length) {
    const additionalImages = product.images.map(img => 
      img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
    );
    allImages.push(...additionalImages);
  }

  const currentImage = allImages[currentImageIndex] || allImages[0];

  return (
    <div className="flex flex-col bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden shadow-md hover:shadow-pink-600/40 transition duration-300">
      {/* Product Image with Gallery */}
      <div className="relative group">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onMouseEnter={() => {
            if (allImages.length > 1) {
              setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }
          }}
          onMouseLeave={() => setCurrentImageIndex(0)}
        />
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {currentImageIndex + 1}/{allImages.length}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h5 className="text-lg font-semibold text-white">
              {product?.name}
            </h5>
            <p className="text-xs text-gray-400">
              {moment(product.createdAt).format("MMMM Do YYYY")}
            </p>
          </div>
          <p className="text-sm text-gray-400 mt-2 line-clamp-3">
            {product?.description?.substring(0, 160)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/admin/product/update/${product._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring focus:ring-pink-500"
          >
            Update Product
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <p className="text-lg font-semibold text-pink-400">
            $ {product?.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
