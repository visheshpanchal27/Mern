import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full max-w-sm mx-auto p-3 relative transition duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] hover:shadow-2xl transition-all duration-500 border border-gray-800 hover:border-pink-500/30">
        
        {/* Image Section */}
        <div className="relative w-full h-[18rem] overflow-hidden rounded-t-2xl group">
          <img
            src={
              product.image.startsWith('http')
                ? product.image
                : `${import.meta.env.VITE_API_URL}${product.image}`
            }          
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition duration-700"
          />

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
