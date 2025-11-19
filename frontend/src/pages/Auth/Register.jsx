import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useFormValidation, validateEmail, validatePassword } from "../../components/FormValidation";
// Simple input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationRules = {
    username: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true }
  };

  const { values, errors, handleChange, validateAll } = useFormValidation(
    { username: '', email: '', password: '', confirmPassword: '' },
    validationRules
  );

  const { username, email, password, confirmPassword } = values;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fix the validation errors", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Loading toast
    const loadingToast = toast.loading("Creating your account...", {
      position: "top-right",
    });

    try {
      const res = await register({ username, email, password }).unwrap();
      toast.dismiss(loadingToast);
      toast.success(res.message || "Registration successful! Please check your email.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/verify-email', { state: { email } });
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage = err?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse || !tokenResponse.access_token) {
          throw new Error("Missing Google access token");
        }

        // Get user info from Google
        const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userData = await userRes.json();
        const { name, email, picture } = userData;

        if (!email.endsWith("@gmail.com")) {
          toast.error("Only Gmail accounts are allowed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        // Call backend Google Auth API
        const backendRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://mernbackend-tmp5.onrender.com'}/api/users/google-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-type': 'web'
          },
          credentials: 'include',
          body: JSON.stringify({
            name,
            email,
            picture
          })
        });

        const backendData = await backendRes.json();
        
        if (!backendRes.ok) {
          throw new Error(backendData.message || 'Google auth failed');
        }

        // Store web token in localStorage
        if (backendData.token) {
          localStorage.setItem('webToken', backendData.token);
        }
        dispatch(setCredentials(backendData));
        navigate(redirect);
        toast.success("Welcome! Google login successful", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error("Google login error:", err);
        toast.error(err.message || "Google login failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
    onError: () => {
      toast.error("Google login failed", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    flow: "implicit",
  });

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
        <div className="bg-background-secondary/90 backdrop-blur-xl border border-primary-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl border border-pink-500/40 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 transform">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://res.cloudinary.com/dhyc478ch/image/upload/e_background_removal/f_png/v1763323471/create_d5i5lb.png"
                  alt="Create Account"
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3 hover:scale-105 transition-transform duration-300">Create Account</h1>
            <p className="text-gray-300 text-lg">Join us today and start your journey</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-3 pl-12 bg-background-tertiary/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500/50 transition-all shadow-inner backdrop-blur-sm"
                  placeholder="Enter your full name"
                  value={sanitizeInput(username)}
                  onChange={handleChange}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.username && <p className="text-red-400 text-sm">{String(errors.username)}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 pl-12 bg-background-tertiary/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500/50 transition-all shadow-inner backdrop-blur-sm"
                  placeholder="Enter your email"
                  value={sanitizeInput(email)}
                  onChange={handleChange}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              {errors.email && <p className="text-red-400 text-sm">{String(errors.email)}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 pl-12 pr-12 bg-background-tertiary/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500/50 transition-all shadow-inner backdrop-blur-sm"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handleChange}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{String(errors.password)}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full px-4 py-3 pl-12 pr-12 bg-background-tertiary/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500/50 transition-all shadow-inner backdrop-blur-sm"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{String(errors.confirmPassword)}</p>}
              {confirmPassword && password !== confirmPassword && <p className="text-red-400 text-sm">Passwords do not match</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-gray-400 bg-background-primary">Or continue with</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loginWithGoogle()}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
          </div>
        </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden lg:block w-full max-w-lg"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80"
              alt="Register Illustration"
              className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
              <p className="text-gray-200">Create an account and discover amazing products</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;