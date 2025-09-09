import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCog } from 'react-icons/fa'

const AppPreferences = () => {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaCog className="mr-2" />
          App Preferences
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Auto Update</span>
            <button
              onClick={() => setAutoUpdate(!autoUpdate)}
              className={`w-12 h-6 rounded-full transition-colors ${autoUpdate ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoUpdate ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppPreferences