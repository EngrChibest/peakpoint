import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // student, teacher, admin

  return (
    <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row">
          {/* Form Side */}
          <div className="w-full p-8 md:p-12">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold mb-8 hover:text-secondary transition-colors w-fit">
              <ArrowLeft size={18} /> Back to Home
            </Link>

            <div className="mb-10 text-center md:text-left">
              <img src={logo} alt="PPIS Logo" className="h-16 mb-6 mx-auto md:mx-0" />
              <h1 className="text-3xl font-bold text-primary mb-2">School Portal</h1>
              <p className="text-text-muted">Welcome back! Please enter your details.</p>
            </div>

            {/* Role Selector */}
            <div className="flex bg-bg-soft p-1.5 rounded-2xl mb-8">
              {['student', 'teacher', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                    role === r 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-text-muted hover:text-primary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary flex items-center gap-2">
                  <Mail size={16} /> Email or Portal ID
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your ID" 
                  className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-primary flex items-center gap-2">
                    <Lock size={16} /> Password
                  </label>
                  <a href="#" className="text-xs font-bold text-secondary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="remember" className="text-sm text-text-muted font-medium cursor-pointer">Remember me for 30 days</label>
              </div>

              <button className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                Log In to Dashboard <ShieldCheck size={20} />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-text-muted">
              Need technical assistance? <a href="#" className="font-bold text-primary hover:underline">Contact IT Support</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
