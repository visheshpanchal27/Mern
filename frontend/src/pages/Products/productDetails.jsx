import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import Loader from "../../components/Loader";
import Massage from "../../components/Massage";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [zoomImage, setZoomImage] = useState(false);

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      if (error?.status === 401) {
        toast.error("You must be logged in to review.");
        navigate("/login");
      } else {
        toast.error(error?.data?.message || error.message || "Failed to submit review");
      }
    }
  };

    const addToCartHandler = async () => {
    try {
      await addToCart({ _id: product._id, qty }).unwrap();
      toast.success("🛒 Product added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      const status = err?.status;
      const serverMessage = err?.data?.message;

      if (status === 401) {
        toast.error("🔐 Please login to add items to your cart.");
        navigate("/login");
      } else if (status === 404) {
        toast.error("📦 Product not found — it might have been removed.");
      } else if (status === 400) {
        toast.error(serverMessage || "⚠️ Invalid request. Please review your action.");
      } else if (status === 500) {
        toast.error("🛠️ Server error — try again shortly.");
      } else {
        toast.error(serverMessage || "🌐 Failed to add to cart. Check your connection.");
      }

      console.error("🧨 Add to cart error:", err);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setZoomImage(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="p-4 xl:px-20">
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer flex items-center gap-2 mb-8 text-gray-300 hover:text-white bg-transparent border border-gray-600 hover:border-pink-500 rounded-full py-2 px-5 transition duration-300"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Go Back
      </button>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Massage variant="danger">
          {error?.data?.message || error.error || "Product not found"}
        </Massage>
      ) : (
        product && (
          <>
            <div className="flex flex-col xl:flex-row gap-10">
              <div className="w-full xl:w-1/2">
                <img
                  onClick={() => setZoomImage(true)}
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${import.meta.env.VITE_API_URL}${product.image}`
                  }
                  alt={product.name}
                  className="w-full max-h-[50rem] object-contain rounded cursor-zoom-in"
                />
              </div>

              <div className="w-full xl:w-1/2 xl:sticky xl:top-20 space-y-6">
                <HeartIcon product={product} className="cursor-pointer" />
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <p className="text-gray-400">{product.description}</p>
                <p className="text-4xl font-extrabold text-pink-600">$ {product.price}</p>

                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div>
                    <p className="flex items-center">
                      <FaStore className="mr-2 text-pink-300" /> Brand: {product.brand}
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-2 text-yellow-300" /> Added: {moment(product.createdAt).fromNow()}
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-green-400" /> Reviews: {product.numReviews}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-yellow-400" /> Rating: {Math.round(product.rating)}
                    </p>
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-2 text-blue-400" /> Quantity: {product.quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-2 text-purple-400" /> In Stock: {product.countInStock}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

                  {product.countInStock > 0 && (
                    <div className="relative w-[8rem]">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="cursor-pointer w-full appearance-none bg-[#1a1a1a] border border-gray-500/40 text-white py-2 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                          <path d="M5.516 7.548a.625.625 0 0 1 .884-.036L10 10.829l3.6-3.317a.625.625 0 0 1 .848.92l-4.042 3.723a.625.625 0 0 1-.848 0L5.552 8.43a.625.625 0 0 1-.036-.882z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={addToCartHandler}
                    disabled={isAddingToCart}
                    className="bg-pink-600 px-6 py-2 rounded-lg text-white hover:bg-pink-700 transition"
                  >
                    {isAddingToCart ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 xl:mx-20">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )
      )}

      {zoomImage && (
        <div
          onClick={() => setZoomImage(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        >
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : `${import.meta.env.VITE_API_URL}${product.image}`
            }
            alt="Zoomed"
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
