import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaArrowRight, FaFire, FaTruck, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Summer Sale",
      subtitle: "Up to 70% OFF",
      description: "Discover amazing deals on trending products",
      bg: "from-pink-600/30 to-purple-600/30"
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh Collection",
      description: "Latest fashion trends just for you",
      bg: "from-purple-600/30 to-pink-600/30"
    },
    {
      title: "Free Shipping",
      subtitle: "On Orders $50+",
      description: "Fast delivery to your doorstep",
      bg: "from-pink-600/20 to-purple-600/40"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative mt-16 px-4 md:px-20 py-12 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-3xl mx-4 md:mx-8 mb-12">
      <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </span>
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#CFCFCF] mb-4">
              {slides[currentSlide].subtitle}
            </h2>
            <p className="text-xl text-[#9CA3AF] mb-8">
              {slides[currentSlide].description}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative max-w-lg mx-auto lg:mx-0 mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-6 py-4 pr-14 text-lg bg-[#1A1A1A]/80 backdrop-blur-md border border-pink-600/30 rounded-full text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 focus:shadow-lg focus:shadow-pink-600/25 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <FaSearch className="text-white" />
              </button>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={() => navigate('/products')}
              className="btn-primary px-8 py-4 rounded-full flex items-center gap-2 justify-center"
            >
              Shop Now <FaArrowRight />
            </button>
            <button
              onClick={() => navigate('/categories')}
              className="btn-secondary px-8 py-4 rounded-full"
            >
              Browse Categories
            </button>
          </motion.div>
        </div>

        {/* Right Content - Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex-1 max-w-md"
        >
          <div className="space-y-6">
            {[
              { icon: FaFire, title: "Hot Deals", desc: "Daily flash sales" },
              { icon: FaTruck, title: "Free Shipping", desc: "On orders $50+" },
              { icon: FaShieldAlt, title: "Secure Payment", desc: "100% protected" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#1A1A1A]/80 to-[#1A1A1A]/60 backdrop-blur-sm rounded-xl border border-pink-600/20 hover:border-pink-600/40 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full shadow-lg shadow-pink-600/25">
                  <feature.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-[#9CA3AF] text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-600/50' 
                : 'bg-[#374151] hover:bg-[#4B5563]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;