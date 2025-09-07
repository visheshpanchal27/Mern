import { useState } from 'react';

const OTPVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStep(2);
        setMessage('OTP sent to your email');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('OTP verified successfully!');
        // Handle success (redirect, etc.)
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to verify OTP');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      
      {step === 1 ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={sendOTP}
            disabled={loading || !email}
            className="w-full bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Enter the 6-digit code sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full p-3 border rounded-lg mb-4 text-center text-lg"
          />
          <button
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full bg-green-500 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            onClick={() => setStep(1)}
            className="w-full mt-2 text-blue-500 underline"
          >
            Change Email
          </button>
        </div>
      )}
      
      {message && (
        <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default OTPVerification;