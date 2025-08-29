import { motion } from 'framer-motion';
import { FaShoppingCart, FaUser, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GuestCartPrompt = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="card-primary p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <FaShoppingCart className="text-4xl text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
          <p className="text-gray-400 mb-6">
            Please sign in to add items to your cart and enjoy a personalized shopping experience.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/login"
              className="btn-primary w-full py-2 flex items-center justify-center gap-2"
            >
              <FaUser className="text-sm" />
              Sign In
            </Link>
            
            <Link
              to="/register"
              className="btn-outline w-full py-2 flex items-center justify-center gap-2"
            >
              <FaUserPlus className="text-sm" />
              Create Account
            </Link>
            
            <button
              onClick={onClose}
              className="btn-secondary w-full py-2 text-sm"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuestCartPrompt;