import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaLock } from 'react-icons/fa'

const Privacy = () => {
  const navigate = useNavigate()

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaLock className="mr-2" />
          Privacy & Security
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Data Collection</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Analytics</span>
            <div className="w-12 h-6 bg-gray-600 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full translate-x-0.5" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Location Services</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full">
              <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Account Security</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              Change Password
            </button>
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              Two-Factor Authentication
            </button>
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              Login History
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Data Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              Download My Data
            </button>
            <button className="w-full text-left p-3 bg-red-900/30 rounded-lg text-red-400">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy