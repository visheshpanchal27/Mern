import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaUser, FaEdit } from 'react-icons/fa'

const AccountSettings = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaUser className="mr-2" />
          Account Settings
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Profile Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white">{userInfo?.username}</p>
              </div>
              <FaEdit className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{userInfo?.email}</p>
              </div>
              <FaEdit className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings