import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);
  const [randomizedProducts, setRandomizedProducts] = useState([]);

  // Shuffle products when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setRandomizedProducts(shuffled.slice(0, 8)); // Show 8 random products
    }
  }, [data]);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const tabClasses = (num) =>
    `transition-all duration-300 px-6 py-2 rounded-full text-sm font-medium cursor-pointer ${
      activeTab === num
        ? "bg-gradient-to-r from-pink-700 to-pink-600 text-white shadow-lg scale-105"
        : "bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
    }`;

  return (
    <div className="w-full px-6 mt-10 flex flex-col items-start">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 backdrop-blur-sm bg-[#111111]/30 p-2 rounded-full shadow-inner">
        <button onClick={() => handleTabClick(1)} className={tabClasses(1)}>
          Write a Review
        </button>
        <button onClick={() => handleTabClick(2)} className={tabClasses(2)}>
          All Reviews
        </button>
        <button onClick={() => handleTabClick(3)} className={tabClasses(3)}>
          Related Products
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-5xl">
        {/* Tab 1: Write Review */}
        {activeTab === 1 && (
          <div>
            {userInfo ? (
              <form
                onSubmit={submitHandler}
                className="flex flex-col gap-6 bg-[#1a1a1a]/50 p-6 rounded-2xl shadow-lg"
              >
                <div>
                  <label className="text-gray-300 mb-2 block text-base">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-[#0f0f0f] text-white focus:ring-2 ring-pink-500 outline-none cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 mb-2 block text-base">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    required
                    className="w-full p-3 rounded-md bg-[#0f0f0f] text-white resize-none focus:ring-2 ring-purple-500 outline-none cursor-text"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className={`self-start px-6 py-2 rounded-md bg-gradient-to-r from-pink-700 to-pink-600 text-white transition flex items-center justify-center gap-2 ${
                    loadingProductReview
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90 cursor-pointer"
                  }`}
                >
                  {loadingProductReview ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            ) : (
              <p className="text-gray-400">
                Please{" "}
                <Link to="/login" className="text-pink-500 underline cursor-pointer">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: All Reviews */}
        {activeTab === 2 && (
          <div className="grid gap-6 mt-4">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gradient-to-br from-[#161616] to-[#1f1f1f] rounded-xl p-6 shadow-lg"
                >
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span className="font-semibold text-white">{review.name}</span>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Related Products */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Related Products</h3>
              <button
                onClick={() => {
                  if (data && data.length > 0) {
                    const shuffled = [...data].sort(() => Math.random() - 0.5);
                    setRandomizedProducts(shuffled.slice(0, 8));
                  }
                }}
                className="text-pink-500 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                🎲 Shuffle Products
              </button>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {isLoading || !randomizedProducts.length ? (
                <Loader />
              ) : (
                randomizedProducts.map((relatedProduct) => (
                  <SmallProduct key={relatedProduct._id} product={relatedProduct} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
