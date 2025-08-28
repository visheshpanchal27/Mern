import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeartIcon from "./HeartIcon";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice"; // <-- Add this

const ProductCard = ({ p, viewMode = 'grid' }) => {
  const [addToCart] = useAddToCartMutation(); // <-- API Hook

  const addToCartHandler = async (product, qty) => {
    try {
      await addToCart({ _id: product._id, qty }).unwrap();

      toast.success("✅ Item added to cart!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      const status = error?.status;
      const message = error?.data?.message;

      if (status === 401) {
        toast.error("🔒 Please login to add items to your cart.");
      } else if (message) {
        toast.error(`⚠️ ${message}`);
      } else {
        toast.error("❌ Failed to add item. Try again.");
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="relative bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          <img
            src={
              p.image.startsWith("http")
                ? p.image
                : `${import.meta.env.VITE_API_URL}${p.image}`
            }
            alt={p.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white text-lg font-semibold line-clamp-1">{p.name}</h3>
              <HeartIcon product={p} />
            </div>
            <p className="text-pink-500 font-bold text-lg mb-2">
              {p.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            <p className="text-[#CFCFCF] text-sm mb-3 line-clamp-2">
              {p.description?.substring(0, 150)}...
            </p>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full">
              {p.brand}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Link
              to={`/product/${p._id}`}
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded-lg transition-all flex-1 text-center"
            >
              View Details
            </Link>
            <button
              onClick={() => addToCartHandler(p, 1)}
              className="p-2 rounded-lg hover:bg-pink-600 transition-all bg-gray-700"
            >
              <AiOutlineShoppingCart size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#1A1A1A] rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col h-full">
      {/* Top Icons */}
      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
        <HeartIcon product={p} />
      </div>
      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
        <span className="bg-pink-100 text-pink-800 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
          {p.brand}
        </span>
      </div>

      {/* Product Image */}
      <Link to={`/product/${p._id}`}>
        <img
          src={
            p.image.startsWith("http")
              ? p.image
              : `${import.meta.env.VITE_API_URL}${p.image}`
          }
          alt={p.name}
          className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-contain p-1 sm:p-2 bg-[#121212] rounded-t-xl sm:rounded-t-2xl"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
        <div>
          <h3 className="text-white text-sm sm:text-base font-semibold mb-1 line-clamp-1 leading-tight">{p.name}</h3>
          <p className="text-pink-500 font-bold text-sm sm:text-base mb-2">
            {p.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p className="text-[#CFCFCF] text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
            {p.description?.substring(0, 60)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto gap-2">
          <Link
            to={`/product/${p._id}`}
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all flex-1 text-center"
          >
            View
          </Link>
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-pink-600 transition-all flex-shrink-0"
          >
            <AiOutlineShoppingCart size={16} className="text-white sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
