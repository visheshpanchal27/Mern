import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Massage from "../../components/Massage";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaShare,
  FaEye,
  FaBolt,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ProductImageGallery from "../../components/ProductImageGallery";
import { ProductDetailsSkeleton } from "../../components/Skeletons";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [zoomImage, setZoomImage] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isOneClickBuying, setIsOneClickBuying] = useState(false);
  const [stockAlert, setStockAlert] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const dispatch = useDispatch();

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

  const addToCartHandler = useCallback(async () => {
    if (!product?._id) {
      toast.error("Product not available");
      return;
    }
    
    // Stock validation
    if (qty > product.countInStock) {
      toast.error(`Only ${product.countInStock} items available in stock`);
      return;
    }
    
    try {
      await addToCart({ _id: product._id, qty }).unwrap();
      setAddedToCart(true);
      toast.success("🛒 Product added to cart successfully!");
      
      // Auto-hide success state after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
      
      // Optional: Navigate to cart after delay
      setTimeout(() => navigate("/cart"), 1500);
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
  }, [product, qty, addToCart, navigate]);

  // Buy now handler - bypasses cart completely
  const buyNowHandler = useCallback(() => {
    if (!userInfo) {
      toast.info("🔒 Please sign in to buy now");
      navigate("/login");
      return;
    }
    
    if (!product?._id || qty > product.countInStock) {
      toast.error("Product not available or insufficient stock");
      return;
    }
    
    localStorage.setItem('buyNowProduct', JSON.stringify({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    }));
    
    navigate('/shipping?buyNow=true');
    toast.success("🚀 Proceeding to checkout!");
  }, [product, qty, userInfo, navigate]);

  // Memoize quantity options with stock validation
  const qtyOptions = useMemo(() => {
    if (!product?.countInStock) return [];
    const maxQty = Math.min(product.countInStock, 10); // Limit to 10 for performance
    return Array.from({ length: maxQty }, (_, i) => i + 1);
  }, [product?.countInStock]);
  
  // Stock monitoring
  useEffect(() => {
    if (product?.countInStock <= 5 && product?.countInStock > 0) {
      setStockAlert(true);
    } else {
      setStockAlert(false);
    }
  }, [product?.countInStock]);
  
  // Quantity validation
  const handleQtyChange = useCallback((newQty) => {
    if (newQty > product?.countInStock) {
      toast.warning(`Only ${product.countInStock} items available`);
      return;
    }
    setQty(newQty);
  }, [product?.countInStock]);

  const shareProduct = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setZoomImage(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Track recently viewed products
  useEffect(() => {
    if (product?._id) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updated = [product._id, ...viewed.filter(id => id !== product._id)].slice(0, 5);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      setRecentlyViewed(updated);
    }
  }, [product?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div 
              key={i}
              className="w-2 h-8 bg-gray-600 rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }
  
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

      {error ? (
        <Massage variant="danger">
          {error?.data?.message || error.error || "Product not found"}
        </Massage>
      ) : (
        product && (
          <>
            <div className="flex flex-col xl:flex-row gap-10">
              <div className="w-full xl:w-1/2">
                <ProductImageGallery 
                  product={product} 
                  onImageClick={() => setZoomImage(true)}
                  isLoading={isLoading}
                />
              </div>

              <div className="w-full xl:w-1/2 xl:sticky xl:top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <HeartIcon product={product} className="cursor-pointer" />
                  <div className="flex gap-2">
                    <button
                      onClick={shareProduct}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition"
                      title="Share Product"
                    >
                      <FaShare className="text-white" />
                    </button>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <FaEye />
                      <span>{recentlyViewed.length} recently viewed</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <p className="text-gray-400">{product.description}</p>
                <div className="flex items-center gap-4">
                  <p className="text-4xl font-extrabold text-pink-600">$ {product.price}</p>
                  {product.countInStock > 0 && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      In Stock
                    </span>
                  )}
                </div>

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

                {/* Stock Alert */}
                {stockAlert && (
                  <div className="bg-orange-500/20 border border-orange-500 text-orange-400 px-4 py-2 rounded-lg flex items-center gap-2">
                    <FaClock className="text-sm" />
                    <span className="text-sm">Only {product.countInStock} left in stock!</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

                  {product.countInStock > 0 && (
                    <div className="relative w-[8rem]">
                      <select
                        value={qty}
                        onChange={(e) => handleQtyChange(Number(e.target.value))}
                        className="cursor-pointer w-full appearance-none bg-[#1a1a1a] border border-gray-500/40 text-white py-2 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600"
                      >
                        {qtyOptions.map((x) => (
                          <option key={x} value={x}>
                            {x}
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

                  {/* Enhanced Buy Buttons */}
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={addToCartHandler}
                      disabled={isAddingToCart || product.countInStock === 0 || addedToCart}
                      className={`flex-1 sm:flex-none px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        product.countInStock === 0
                          ? "bg-gray-600 cursor-not-allowed"
                          : addedToCart
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-pink-600 hover:bg-pink-700 hover:scale-105"
                      }`}
                    >
                      {isAddingToCart ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      ) : addedToCart ? (
                        <>
                          <FaCheck className="text-sm" />
                          Added to Cart
                        </>
                      ) : product.countInStock === 0 ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <FaShoppingCart className="text-sm" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    {/* Buy Now Button */}
                    {product.countInStock > 0 && (
                      <button
                        onClick={buyNowHandler}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                      >
                        <FaBolt className="text-sm" />
                        Buy Now
                      </button>
                    )}
                  </div>


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

      {zoomImage && product && (
        <div
          onClick={() => setZoomImage(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        >
          <ProductImageGallery 
            product={product} 
            showThumbnails={false}
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
