import { motion } from "framer-motion";

const SizeSelector = ({ 
  sizes = [], 
  selectedSize, 
  onSizeSelect, 
  className = "",
  variant = "default" // default, compact, large
}) => {
  if (!sizes || sizes.length === 0) return null;

  const variants = {
    default: "px-4 py-2 text-sm",
    compact: "px-3 py-1.5 text-xs",
    large: "px-6 py-3 text-base"
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-300">Size</h4>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSizeSelect(size)}
            className={`${variants[variant]} rounded-lg border transition-all font-medium ${
              selectedSize === size
                ? 'border-pink-400 bg-pink-400/10 text-pink-400'
                : 'border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white'
            }`}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;