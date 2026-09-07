import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';






const LogInPage = () => {

    const nav = useNavigate();

      const [showPw, setShowPw] = useState(false);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');


  const handle_email = (e) => {
    setEmail(e.target.value);
  };

  const handle_password = (e) => {
    setPassword(e.target.value);
  };

  const handle_login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        { email, password },
        { withCredentials: true }
      );

      alert(`Logged in successfully ${response.data.user || response.data.email || 'user'}`);
      nav('/');
    } catch (error) {
      const err = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      alert(err);
      nav('/signup');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <h1 className="mt-6 text-xl font-bold">Welcome back!</h1>
        <p className="text-sm text-gray-500 mt-1">Log in to continue building your future.</p>
      
        <form className="mt-6 space-y-4" onSubmit={handle_login}>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={handle_email}
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
                value={password}
                onChange={handle_password}
                required
                placeholder="Enter your password"
                className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="button"
                 onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p onClick={() => nav('/passwordreset')} className="text-xs font-medium text-violet-600">Forgot password?</p>
          </div>
          <button type="submit" className="w-full bg-black hover:bg-black/90 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Login
          </button>
        </form>
<br />

<a href="http://localhost:3000/auth/google">login with google</a>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button onClick={() => nav('/signup')} className="font-sm text-blue-600">Sign up</button>
        </p>
      </div>
    </div>
  );
}

export default LogInPage