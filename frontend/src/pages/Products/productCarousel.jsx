import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../../components/Massage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import axios from "axios";
import HeartIcon from "./HeartIcon";
import { PRODUCTS_URL } from "../../redux/constants.js";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    fade: true,
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(`${PRODUCTS_URL}/allProducts`);
        const allProducts = data.products || data;
        
        // Shuffle and select 10-15 products randomly
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const randomCount = Math.floor(Math.random() * 6) + 10; // 10-15 products
        const selectedProducts = shuffled.slice(0, randomCount);
        
        setProducts(selectedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Improved BigProductSkeleton with image + details placeholders, matching real card size
  const BigProductSkeleton = () => (
    <div className="w-[40rem] ml-[0.3rem] p-3 relative animate-pulse">
      <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Image placeholder */}
        <div className="w-full h-[15rem] bg-gray-700 rounded-t-3xl" />

        {/* Details placeholder */}
        <div className="p-4 space-y-3">
          {/* Product name & price */}
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-600 rounded-md"></div>
            <div className="h-6 w-16 bg-gray-600 rounded-md"></div>
          </div>

          {/* Brand & time */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-20 bg-gray-600 rounded-md"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-14 bg-gray-600 rounded-md"></div>
            </div>
          </div>

          {/* Reviews & rating */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-20 bg-gray-600 rounded-md"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-16 bg-gray-600 rounded-md"></div>
            </div>
          </div>

          {/* Qty & In Stock */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-16 bg-gray-600 rounded-md"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-600 rounded-full" />
              <div className="h-4 w-20 bg-gray-600 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto xl:mr-[2rem] px-4 py-6">
      {isLoading ? (
        <BigProductSkeleton />
      ) : isError ? (
        <Message variant="danger">Something went wrong!</Message>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="p-1">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${import.meta.env.VITE_API_URL}${product.image}`
                  }
                  alt={product.name}
                  className="w-full h-[24rem] object-cover opacity-90 hover:opacity-100 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 z-10">
                  <HeartIcon product={product} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm text-white rounded-t-3xl">
                  <h2 className="text-lg font-bold hover:text-pink-400">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h2>
                  <p className="text-pink-400 font-bold">${product.price}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <p className="flex items-center">
                      <FaStore className="mr-1 text-pink-300" />
                      {product.brand}
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-1 text-yellow-300" />
                      {moment(product.createdAt).fromNow()}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <p className="flex items-center">
                      <FaStar className="mr-1 text-green-400" />
                      {product.numReviews} Reviews
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      {Math.round(product.rating)} Rating
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-1 text-blue-400" />
                      Qty: {product.quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-1 text-purple-400" />
                      In Stock: {product.countInStock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
