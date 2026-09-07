import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/auth';

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const LogInPage = ({ onLogin }) => {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loginStep, setLoginStep] = useState('credentials');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!otpExpiresAt) return;

    const updateCountdown = () => {
      const remainingSeconds = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setCountdown(remainingSeconds);

      if (remainingSeconds === 0) {
        setError('OTP expired. Please request a new code.');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to request OTP');
        setLoading(false);
        return;
      }

      const expiresAt = data.expiresAt || Date.now() + 5 * 60 * 1000;
      setSessionId(data.sessionId);
      setOtpExpiresAt(expiresAt);
      setLoginStep('verify');
      setMessage(`Your OTP is ${data.otp}. Enter it below to continue.`);
    } catch (err) {
      setError('Error communicating with server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sessionId,
          otp: twoFactorCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid OTP');
        setLoading(false);
        return;
      }

      onLogin?.();
      nav('/edit');
    } catch (err) {
      setError('Error verifying OTP: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to resend OTP');
        setLoading(false);
        return;
      }

      const expiresAt = data.expiresAt || Date.now() + 5 * 60 * 1000;
      setSessionId(data.sessionId);
      setTwoFactorCode('');
      setOtpExpiresAt(expiresAt);
      setMessage(`New OTP is ${data.otp}. Enter it below to continue.`);
    } catch (err) {
      setError('Error resending OTP: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-3 flex items-center justify-center text-violet-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-center">Admin 2FA login</h1>
        <p className="text-sm text-gray-500 mt-1 text-center">
          {loginStep === 'credentials'
            ? 'Enter your admin credentials to begin.'
            : 'Verify the one-time code to continue.'}
        </p>

        {message && <p className="mt-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-700">{message}</p>}
        {loginStep === 'verify' && otpExpiresAt && (
          <p className="mt-2 text-right text-xs font-medium text-amber-600">
            Expires in {formatCountdown(countdown)}
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loginStep === 'credentials' ? (
          <form className="mt-6 space-y-4" onSubmit={handleCredentialSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleTwoFactorSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">OTP Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-black hover:bg-black/90 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Resend
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LogInPage;
