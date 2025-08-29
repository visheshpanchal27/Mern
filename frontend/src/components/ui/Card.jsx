import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Card = forwardRef(({ 
  children, 
  variant = 'primary', 
  hover = true,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'transition-all duration-300';
  
  const variants = {
    primary: 'bg-background-secondary rounded-xl shadow-lg border border-gray-800',
    secondary: 'bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700',
    glass: 'bg-black/20 backdrop-blur-md rounded-xl border border-gray-700/50',
    gradient: 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700'
  };
  
  const hoverEffects = hover ? 'hover:shadow-xl hover:scale-[1.02]' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverEffects} ${className}`;
  
  return (
    <motion.div
      ref={ref}
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;