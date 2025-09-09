import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }
    toast.success('Password changed successfully')
    navigate(-1)
  }

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaLock className="mr-2" />
          Change Password
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

export default ChangePassword