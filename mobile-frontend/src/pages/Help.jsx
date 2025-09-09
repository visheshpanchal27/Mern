import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaQuestionCircle } from 'react-icons/fa'

const Help = () => {
  const navigate = useNavigate()

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaQuestionCircle className="mr-2" />
          Help & Support
        </h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-1">How do I track my order?</h4>
              <p className="text-gray-400 text-sm">Go to My Orders and click on your order to see tracking details.</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-1">How do I return an item?</h4>
              <p className="text-gray-400 text-sm">Contact support within 30 days of purchase for return instructions.</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-1">Payment methods accepted?</h4>
              <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and cash on delivery.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Contact Support</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-600 rounded-lg text-white">
              📧 Email Support
            </button>
            <button className="w-full text-left p-3 bg-green-600 rounded-lg text-white">
              💬 Live Chat
            </button>
            <button className="w-full text-left p-3 bg-purple-600 rounded-lg text-white">
              📞 Call Support
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              📖 User Guide
            </button>
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              🎥 Video Tutorials
            </button>
            <button className="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300">
              📋 Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help