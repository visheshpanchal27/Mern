import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBolt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useMemo, useEffect, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import HeartIcon from "./HeartIcon";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import { ProductCardSkeleton } from "../../components/Skeletons";
import QuickViewModal from "../../components/QuickViewModal";

const ProductCard = ({ p, viewMode = 'grid', isLoading = false }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);

  if (isLoading || !p) return <ProductCardSkeleton viewMode={viewMode} />;

  // Get all product images
  const allImages = useMemo(() => {
    const images = [];
    if (p.image) {
      const mainImageUrl = p.image.startsWith("http")
        ? p.image
        : `${import.meta.env.VITE_API_URL}${p.image}`;
      images.push(mainImageUrl);
    }
    if (p.images?.length) {
      const additionalImages = p.images.map(img => 
        img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    return images;
  }, [p.image, p.images]);

  // Random image on page refresh/reload (unique per product)
  useEffect(() => {
    if (allImages.length > 1 && p?._id) {
      // Use product ID to create unique seed for each product
      const seed = parseInt(p._id.slice(-4), 16) || Math.floor(Math.random() * 1000);
      const randomIndex = Math.floor((seed + Date.now() + refreshKey) % allImages.length);
      setCurrentImageIndex(randomIndex);
    }
  }, [allImages.length, refreshKey, p?._id]);

  // Auto-cycle images with unique timing per product
  useEffect(() => {
    if (allImages.length > 1 && p?._id) {
      // Different interval for each product based on ID
      const baseInterval = 4000;
      const productOffset = (parseInt(p._id.slice(-2), 16) % 1000) || 0;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      }, baseInterval + productOffset);
      return () => clearInterval(interval);
    }
  }, [allImages.length, p?._id]);

  const currentImage = allImages[currentImageIndex] || allImages[0];

  const addToCartHandler = useCallback(async (product, qty) => {
    if (!userInfo) {
      toast.info("🔒 Please sign in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

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
  }, [userInfo, addToCart]);

  const buyNowHandler = useCallback((product) => {
    if (!userInfo) {
      toast.info("🔒 Please sign in to buy now");
      return;
    }
    
    localStorage.setItem('buyNowProduct', JSON.stringify({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    }));
    
    navigate('/shipping?buyNow=true');
    toast.success("🚀 Proceeding to checkout!");
  }, [userInfo, navigate]);

  if (viewMode === 'list') {
    return (
      <div className="card-primary overflow-hidden flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0 relative group">
          <img
            src={currentImage}
            alt={p.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          {allImages.length > 1 && (
            <>
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1}/{allImages.length}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRefreshKey(prev => prev + 1);
                }}
                className="absolute top-1 right-1 bg-black/70 hover:bg-pink-600/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                🎲
              </button>
            </>
          )}
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
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Link
              to={`/product/${p._id}`}
              className="btn-primary text-sm px-4 py-2 flex-1 text-center"
            >
              View Details
            </Link>
            <button
              onClick={() => addToCartHandler(p, 1)}
              className="bg-gray-700 hover:bg-pink-600 p-2 rounded-lg transition-all"
              title="Add to cart"
            >
              <AiOutlineShoppingCart size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="card-primary overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col h-full relative">
      {/* Top Icons */}
      <div className="absolute top-2 left-2 z-10">
        <HeartIcon product={p} />
      </div>

      {/* Product Image */}
      <Link to={`/product/${p._id}`} className="relative group">
        <img
          src={currentImage}
          alt={p.name}
          className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-contain p-1 sm:p-2 bg-white rounded-t-xl sm:rounded-t-2xl transition-all duration-300"
          loading="lazy"
        />
        {allImages.length > 1 && (
          <>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImageIndex + 1}/{allImages.length}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setRefreshKey(prev => prev + 1);
              }}
              className="absolute top-2 right-2 bg-black/70 hover:bg-pink-600/70 text-white text-xs p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              🎲
            </button>
          </>
        )}
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

        <div className="flex items-center mt-auto gap-2">
          <button
            onClick={() => setShowQuickView(true)}
            className="btn-secondary text-xs px-3 py-1.5 flex-1"
          >
            Quick View
          </button>
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="bg-gray-700 hover:bg-pink-600 p-2 rounded transition-all"
            title="Add to cart"
          >
            <AiOutlineShoppingCart size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
    
    <QuickViewModal 
      product={p} 
      isOpen={showQuickView} 
      onClose={() => setShowQuickView(false)} 
    />
    </>
  );
};

export default memo(ProductCard);
