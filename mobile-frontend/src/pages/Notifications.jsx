import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBell } from 'react-icons/fa'

const Notifications = () => {
  const navigate = useNavigate()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [orderUpdates, setOrderUpdates] = useState(true)

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaBell className="mr-2" />
          Notifications
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Push Notifications</span>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Email Notifications</span>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Order Updates</span>
            <button
              onClick={() => setOrderUpdates(!orderUpdates)}
              className={`w-12 h-6 rounded-full transition-colors ${orderUpdates ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${orderUpdates ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications