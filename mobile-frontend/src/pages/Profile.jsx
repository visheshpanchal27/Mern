import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { clearCart } from '../store/cartSlice'
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt, FaArrowRight } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Profile = () => {
  const { userInfo } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    console.log('Mobile logout initiated')
    dispatch(logout())
    dispatch(clearCart())
    
    // Mobile logout - no sync with PC
    
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (!userInfo) {
    return (
      <div className="safe-area-top p-4 text-center">
        <div className="py-20">
          <FaUser className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400 mb-6">Please sign in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const menuItems = [
    { icon: FaShoppingBag, label: 'My Orders', action: () => navigate('/user-orders') },
    { icon: FaHeart, label: 'Favorites', action: () => navigate('/favorites') },
    { icon: FaUser, label: 'Account Settings', action: () => navigate('/account-settings') },
    { icon: FaCog, label: 'Settings', action: () => navigate('/settings') },
  ]

  return (
    <div className="safe-area-top">
      {/* Profile Header */}
      <div className="p-4 bg-gradient-to-r from-primary to-secondary">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <FaUser size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{userInfo.username}</h1>
            <p className="text-pink-100">{userInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center justify-between p-4 bg-dark-light rounded-xl active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-3">
              <Icon className="text-primary" size={20} />
              <span className="font-medium">{label}</span>
            </div>
            <FaArrowRight className="text-gray-400" size={16} />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-red-600 rounded-xl active:scale-95 transition-transform"
        >
          <FaSignOutAlt size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Profile