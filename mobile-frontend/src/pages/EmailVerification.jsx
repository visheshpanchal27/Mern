import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const EmailVerification = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Invalid verification link')
    }
  }, [token])

  const verifyEmail = async (verificationToken) => {
    try {
      console.log('Verifying email with token:', verificationToken)
      // Replace with actual API call
      const response = await fetch(`/api/users/verify-email?token=${verificationToken}`)
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage('Email verified successfully!')
        console.log('Email verification successful')
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setStatus('error')
        setMessage(data.message || 'Verification failed')
        console.error('Email verification failed:', data)
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const resendVerification = async () => {
    try {
      console.log('Resending verification email...')
      // Replace with actual API call
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setMessage('Verification email sent! Check your inbox.')
        console.log('Verification email resent successfully')
      } else {
        console.error('Failed to resend verification email')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setMessage('Failed to resend email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md text-center">
        <div className="mb-6">
          {status === 'verifying' && (
            <>
              <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-bold mb-2">Verifying Email</h2>
              <p className="text-gray-400">Please wait while we verify your email...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-green-500">Email Verified!</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-red-500">Verification Failed</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  className="w-full btn-primary mb-3"
                >
                  Resend Verification Email
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-secondary"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerification