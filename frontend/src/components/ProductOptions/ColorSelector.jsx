import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const ColorSelector = ({ 
  colors = [], 
  selectedColor, 
  onColorSelect, 
  className = "",
  variant = "default" // default, compact, large
}) => {
  if (!colors || colors.length === 0) return null;

  const sizes = {
    default: "w-10 h-10",
    compact: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-300">Color</h4>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => (
          <motion.button
            key={color.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onColorSelect(color.name)}
            className={`${sizes[variant]} rounded-full border-2 transition-all relative ${
              selectedColor === color.name
                ? 'border-pink-400 shadow-lg shadow-pink-400/25'
                : 'border-gray-600 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor === color.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <FaCheck 
                  className={`${color.hex === '#FFFFFF' || color.hex === '#ffffff' ? 'text-gray-800' : 'text-white'}`} 
                  size={variant === 'compact' ? 10 : variant === 'large' ? 14 : 12} 
                />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;