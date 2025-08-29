import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle, imageSrc, imageAlt }) => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 bg-background-primary">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="card-secondary p-8 lg:p-10 max-w-md w-full mb-8 lg:mb-0 lg:mr-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl text-primary-500 font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {children}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 max-w-lg"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
        />
      </motion.div>
    </section>
  );
};

export default AuthLayout;