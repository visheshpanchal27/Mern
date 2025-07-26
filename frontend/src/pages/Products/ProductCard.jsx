import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeartIcon from "./HeartIcon";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice"; // <-- Add this

const ProductCard = ({ p }) => {
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

  return (
    <div className="relative bg-[#1A1A1A] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col">
      {/* Top Icons */}
      <div className="absolute top-2 left-2 z-10">
        <HeartIcon product={p} />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full">
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
          className="w-full h-48 sm:h-52 md:h-56 object-contain p-2 bg-[#121212] rounded-t-2xl"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="text-white text-base font-semibold mb-1 line-clamp-1">{p.name}</h3>
          <p className="text-pink-500 font-bold text-sm mb-2">
            {p.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p className="text-[#CFCFCF] text-sm mb-3 line-clamp-2">
            {p.description?.substring(0, 90)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
          >
            Read More
          </Link>
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="p-2 rounded-full hover:bg-pink-600 transition-all"
          >
            <AiOutlineShoppingCart size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
