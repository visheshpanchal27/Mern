import { motion } from 'framer-motion';

const ResponsiveLayout = ({ children, className = '', animate = true }) => {
  const baseClasses = "responsive-container min-h-screen";
  const combinedClasses = `${baseClasses} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={combinedClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;