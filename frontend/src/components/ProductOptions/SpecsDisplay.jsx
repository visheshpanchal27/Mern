import { motion } from "framer-motion";

const SpecsDisplay = ({ 
  specifications = {}, 
  className = "",
  variant = "default" // default, compact, detailed
}) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-400">No specifications available</p>
      </div>
    );
  }

  const variants = {
    default: "py-2 px-3 text-sm",
    compact: "py-1 px-2 text-xs",
    detailed: "py-3 px-4 text-base"
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(specifications).map(([key, value], idx) => (
        <motion.div 
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`${variants[variant]} bg-gray-800/20 rounded-lg border-l-2 border-pink-400/30 flex justify-between items-center`}
        >
          <span className="text-gray-400 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
          <span className="text-white font-medium">{value}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default SpecsDisplay;