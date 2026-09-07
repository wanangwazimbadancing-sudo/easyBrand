import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const SignUp = () => {
    
     const nav = useNavigate();
      const [showPw, setShowPw] = useState(false);


      const[username,setUsername]= useState("");
      const[email,setEmail]= useState("");
      const[password,setPassword]= useState("");


      const handle_username = (e) =>{ setUsername(e.target.value)}
      const handle_email = (e) =>{setEmail(e.target.value)}
      const handle_password = (e) =>{setPassword(e.target.value)}



         const handle_signup = async(e) =>{
           
   e.preventDefault();

          try {
  const response = await axios.post('http://localhost:3000/register', {username,email,password},{withCredentials:true})

            alert(`account created sucessfully {response.email}`);
            nav("/login");

          } catch (error) {
            const err = error.response.data?.error;
            alert(err);
            console.log(err);
            
          }


         }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <h1 className="mt-6 text-xl font-bold">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Start building your future today.</p>
        
        <form onSubmit={handle_signup} className="mt-6 space-y-4" >
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input required placeholder="Enter your full name" value={username} onChange={handle_username} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1.5 relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" required placeholder="Enter your email" value={email} onChange={handle_email} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1.5 relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={handle_password} required placeholder="Create a password" className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit"  className="w-full bg-black hover:bg-black/90 text-white font-semibold py-2.5 rounded-lg transition-colors">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={() => nav('/login')} className="font-sm text-blue-600">Login</button>
        </p>
      </div>
    </div>
  );
}

export default SignUp