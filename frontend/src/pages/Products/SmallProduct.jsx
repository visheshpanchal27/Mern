import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product, isLoading }) => {
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
      <div className="relative bg-white rounded-xl p-2">
        <img
          src={
            product.image?.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_API_URL}${product.image}`
          }
          alt={product.name}
          className="h-32 w-auto mx-auto object-contain"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
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
