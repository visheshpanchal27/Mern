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
      toast.error("Please fix the validation errors");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse || !tokenResponse.access_token) {
          throw new Error("Missing Google access token");
        }

        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const data = await res.json();
        const { name, email, picture } = data;

        if (!email.endsWith("@gmail.com")) {
          toast.error("Only Gmail accounts are allowed");
          return;
        }

        dispatch(setCredentials({ username: name, email, image: picture }));
        navigate(redirect);
        toast.success("Google login successful");
      } catch (err) {
        console.error("Google login error:", err);
        toast.error("Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
    flow: "implicit",
  });

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 bg-gradient-to-tr from-[#0f0f0f] to-[#1a1a1a]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a1a]/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h1 className="text-3xl text-pink-500 font-bold mb-8 text-center">Register</h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div>
            <label htmlFor="username" className="block text-sm text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`w-full p-3 bg-[#0f0f0f] border rounded-lg text-white focus:ring-2 outline-none ${
                errors.username ? 'border-red-500 ring-red-500' : 'border-pink-500 ring-pink-500'
              }`}
              placeholder="Enter name"
              value={username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full p-3 bg-[#0f0f0f] border rounded-lg text-white focus:ring-2 outline-none ${
                errors.email ? 'border-red-500 ring-red-500' : 'border-pink-500 ring-pink-500'
              }`}
              placeholder="Enter email"
              value={email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={`w-full p-3 bg-[#0f0f0f] border rounded-lg text-white focus:ring-2 outline-none pr-10 ${
                errors.password ? 'border-red-500 ring-red-500' : 'border-pink-500 ring-pink-500'
              }`}
              placeholder="Enter password (8+ chars, uppercase, lowercase, number)"
              value={password}
              onChange={handleChange}
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-11.5 text-gray-300 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className={`w-full p-3 bg-[#0f0f0f] border rounded-lg text-white focus:ring-2 outline-none pr-10 ${
                errors.confirmPassword || (confirmPassword && password !== confirmPassword) ? 'border-red-500 ring-red-500' : 'border-pink-500 ring-pink-500'
              }`}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleChange}
            />
            <div
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-11.5 text-gray-300 cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            {confirmPassword && password !== confirmPassword && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-600 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-400 bg-[#1a1a1a]">Or continue with</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => loginWithGoogle()}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition duration-200 shadow-lg cursor-pointer"
        >
          <FcGoogle size={22} />
          <span className="text-sm">Continue with Google</span>
        </motion.button>

        <div className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-500 hover:underline"
          >
            Login
          </Link>
        </div>
      </motion.div>

      <motion.img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80"
        alt="Register Illustration"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden md:block md:w-1/2 object-cover h-screen rounded-2xl ml-10"
      />
    </section>
  );
};

export default Register;
