import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaInfoCircle className="mr-2" />
          About
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="text-center bg-gray-800 p-6 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="https://res.cloudinary.com/dhyc478ch/image/upload/v1763318624/logo_kxilm7.svg" 
              alt="INFINITY PLAZA Logo" 
              className="w-full h-full select-none pointer-events-none"
            />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-orange-400 to-pink-400 bg-clip-text text-transparent mb-2">INFINITY PLAZA</h2>
          <p className="text-gray-400 mb-2">Version 1.0.0</p>
          <p className="text-gray-300 text-sm">Your ultimate shopping destination</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Build:</span>
              <span className="text-white">2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white">Mobile Web</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Developer:</span>
              <span className="text-white">Vishesh panchal</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Features</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 text-sm">Product Browsing & Search</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 text-sm">Shopping Cart & Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 text-sm">Order Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 text-sm">Favorites & Wishlist</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 text-sm">User Profiles</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-gray-300 text-sm">
              Privacy Policy
            </button>
            <button className="w-full text-left p-2 text-gray-300 text-sm">
              Terms of Service
            </button>
            <button className="w-full text-left p-2 text-gray-300 text-sm">
              Licenses
            </button>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-xs">
          © 2024 Infinity Plaza. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default About