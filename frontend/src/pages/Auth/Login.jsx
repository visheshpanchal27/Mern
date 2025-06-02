import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Login successful");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  const googleSuccess = async (tokenResponse) => {
    try {
      if (!tokenResponse || !tokenResponse.credential) {
        toast.error("Google token not received. Please try again.");
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(tokenResponse.credential);
      } catch (err) {
        toast.error("Failed to decode Google token.");
        return;
      }

      const { name, email, picture } = decoded;

      if (!name || !email) {
        toast.error("Missing user information from Google account.");
        return;
      }

      dispatch(setCredentials({ username: name, email, image: picture }));
      navigate(redirect);
      toast.success("Google login successful");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Unexpected error during Google login");
    }
  };

  const googleError = () => {
    toast.error("Google login was cancelled or failed. Please try again.");
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: googleSuccess,
    onError: googleError,
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
        <h1 className="text-3xl text-pink-500 font-bold mb-8 text-center">Sign In</h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-[#0f0f0f] border border-pink-500 rounded-lg text-white focus:ring-2 ring-pink-500 outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 bg-[#0f0f0f] border border-pink-500 rounded-lg text-white focus:ring-2 ring-pink-500 outline-none pr-10"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-11.5 text-gray-300 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-700 to-pink-600 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
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
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </motion.div>

      <motion.img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80"
        alt="Login Illustration"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden md:block md:w-1/2 object-cover h-screen rounded-2xl ml-10"
      />
    </section>
  );
};

export default Login;
