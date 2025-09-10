import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaTruck, FaPaypal, FaMoneyBillWave } from 'react-icons/fa'

const Shipping = () => {
  const navigate = useNavigate()
  
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}')
  const savedPayment = localStorage.getItem('paymentMethod') || 'PayPal'
  
  const [address, setAddress] = useState(savedAddress.address || '')
  const [city, setCity] = useState(savedAddress.city || '')
  const [postalCode, setPostalCode] = useState(savedAddress.postalCode || '')
  const [country, setCountry] = useState(savedAddress.country || '')
  const [paymentMethod, setPaymentMethod] = useState(savedPayment)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const shippingData = { address, city, postalCode, country }
    
    localStorage.setItem('shippingAddress', JSON.stringify(shippingData))
    localStorage.setItem('paymentMethod', paymentMethod)
    
    navigate('/placeorder')
  }

  const isValid = address && city && postalCode && country

  return (
    <div className="safe-area-top bg-dark min-h-screen">
      <div className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 mr-3">
          <FaArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center">
          <FaTruck className="mr-2" />
          Shipping & Payment
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Shipping Address</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input"
              required
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className={`flex items-center p-3 rounded-lg border-2 ${
              paymentMethod === 'PayPal' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <FaPaypal className="text-blue-400 mr-3" />
              <span className="text-white">PayPal</span>
            </label>
            
            <label className={`flex items-center p-3 rounded-lg border-2 ${
              paymentMethod === 'CashOnDelivery' ? 'border-green-500 bg-green-500/10' : 'border-gray-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="CashOnDelivery"
                checked={paymentMethod === 'CashOnDelivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <FaMoneyBillWave className="text-green-400 mr-3" />
              <span className="text-white">Cash on Delivery</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full btn-primary disabled:opacity-50"
        >
          Save & Continue to Checkout
        </button>
      </form>
    </div>
  )
}

export default Shipping