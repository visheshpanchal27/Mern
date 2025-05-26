import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

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
    <div className="min-h-screen bg-[#0f0f0f] relative">
      {/* Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-full w-20 bg-black flex-col items-center py-6 z-20">
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:ml-20">
        <h1 className="text-2xl font-bold mb-6 text-white">
          All Products ({products.length})
        </h1>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden shadow-md hover:shadow-pink-600/40 transition duration-300"
            >
              {/* Product Image */}
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `${import.meta.env.VITE_API_URL}${product.image}`
                }
                alt={product.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
