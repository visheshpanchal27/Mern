import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../api/apiSlice'
import { setCredentials } from '../store/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = await login({ email, password }).unwrap()
      // Store mobile token in localStorage
      if (userData.token) {
        localStorage.setItem('mobileToken', userData.token)
      }
      dispatch(setCredentials(userData))
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      toast.error(error?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 safe-area-top">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-1 shadow-xl border border-pink-500/40 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 transform">
              <img
                src="https://res.cloudinary.com/dhyc478ch/image/upload/e_background_removal/f_png/v1763321270/login_pey1s7.png"
                alt="Shopping Login"
                className="w-full h-full object-contain drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login