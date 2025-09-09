import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaCog, FaBell, FaLock, FaUser, FaSignOutAlt, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Settings = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)
  const [notifications, setNotifications] = useState(true)
  const [loading, setLoading] = useState(null)

  const handleLogout = () => {
    setLoading('logout')
    setTimeout(() => {
      localStorage.removeItem('mobileUserInfo')
      localStorage.removeItem('mobileToken')
      localStorage.removeItem('cartItems')
      window.location.href = '/login'
    }, 500)
  }

  const handleNavigation = (path, key) => {
    setLoading(key)
    setTimeout(() => {
      navigate(path)
      setLoading(null)
    }, 300)
  }

  const settingsItems = [
    { icon: FaUser, label: 'Profile', action: () => handleNavigation('/profile', 'profile'), key: 'profile' },
    { icon: FaBell, label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
    { icon: FaLock, label: 'Privacy & Security', action: () => handleNavigation('/privacy', 'privacy'), key: 'privacy' },
    { icon: FaCog, label: 'App Preferences', action: () => handleNavigation('/app-preferences', 'preferences'), key: 'preferences' },
    { icon: FaUser, label: 'Account Settings', action: () => handleNavigation('/account-settings', 'account'), key: 'account' },
    { icon: FaBell, label: 'Push Notifications', action: () => handleNavigation('/notifications', 'push'), key: 'push' },
    { icon: FaLock, label: 'Change Password', action: () => handleNavigation('/change-password', 'password'), key: 'password' },
    { icon: FaCog, label: 'Language', action: () => handleNavigation('/language', 'language'), key: 'language' },
    { icon: FaUser, label: 'Help & Support', action: () => handleNavigation('/help', 'help'), key: 'help' },
    { icon: FaBell, label: 'About', action: () => handleNavigation('/about', 'about'), key: 'about' },
    { icon: FaSignOutAlt, label: 'Logout', action: handleLogout, danger: true, key: 'logout' },
  ]

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaCog className="mr-2" />
          Settings
        </h1>
      </div>

      {/* Settings List */}
      <div className="p-4 space-y-2">
        {settingsItems.map((item, index) => (
          <motion.button
            key={index}
            onClick={item.toggle ? undefined : item.action}
            disabled={!item.toggle && loading === item.key}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between p-4 bg-gray-800 rounded-xl disabled:opacity-50 ${
              item.danger ? 'border border-red-500/30' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={item.danger ? 'text-red-400' : 'text-gray-400'} size={20} />
              <span className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                {item.label}
              </span>
            </div>
            
            {item.toggle ? (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  item.onChange(!item.value)
                }}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  item.value ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  item.value ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            ) : (
              <div className="text-gray-400">
                {loading === item.key ? (
                  <FaSpinner className="animate-spin" size={16} />
                ) : (
                  '→'
                )}
              </div>
            )}

          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default Settings