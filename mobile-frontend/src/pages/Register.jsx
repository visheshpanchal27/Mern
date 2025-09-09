import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '../api/apiSlice'
import { setCredentials } from '../store/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Mobile registration started')
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      console.log('Registering user:', { username: formData.username, email: formData.email })
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }).unwrap()
      
      console.log('Registration response:', response)
      
      // Handle successful registration - should require email verification
      if (response) {
        // Don't auto-login, show verification message instead
        toast.success('Account created! Please check your email to verify your account.')
        console.log('Registration successful, redirecting to login')
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error status:', error?.status)
      console.error('Error data:', error?.data)
      
      // Handle different types of errors
      if (error?.status === 'PARSING_ERROR' || error?.originalStatus === 404) {
        toast.error('Backend server not available. Please try again later.')
      } else if (error?.status === 'FETCH_ERROR') {
        toast.error('Network error. Please check your connection.')
      } else if (error?.status === 400) {
        // Handle validation errors
        console.error('Validation errors:', error?.data?.errors)
        // Log each error individually
        error?.data?.errors?.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err)
        })
        
        if (error?.data?.errors && Array.isArray(error?.data?.errors)) {
          // Show first validation error
          const firstError = error.data.errors[0]
          console.error('First error details:', firstError)
          toast.error(firstError?.msg || firstError?.message || 'Validation failed')
        } else {
          const message = error?.data?.message || error?.data?.error || 'Validation failed'
          toast.error(message)
        }
      } else {
        toast.error(error?.data?.message || error?.message || 'Registration failed')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 safe-area-top">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input pr-12"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Be at least 6 characters long</li>
                <li>Contain uppercase and lowercase letters</li>
                <li>Contain at least one number</li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm">
              📧 After registration, check your email to verify your account before signing in.
            </p>
          </div>
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register