import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, userRole, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // Default role for display
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && currentUser && userRole) {
      navigate(`/portal/${userRole}`);
    }
  }, [currentUser, userRole, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

      try {
        // Smart Login Detection: Handle Portal ID vs Email
        let loginEmail = email.trim();
        if (loginEmail.toUpperCase().startsWith('PPIS/')) {
          // Transform Student Portal ID to virtual email
          loginEmail = `${loginEmail.replace(/\//g, '-').toLowerCase()}@peakpoint.edu`;
        }

      const res = await login(loginEmail, password);
      const user = res.user;
      
      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Show success message before redirect
        setSuccessMessage(`Welcome back, ${userData.fullName}!`);
        
        setTimeout(() => {
          navigate(`/portal/${userData.role}`);
        }, 2000);
      } else {
        setError(`Success! But your profile is missing in the "users" collection (UID: ${user.uid}). Please add it in Firestore.`);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid Email/ID or Password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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


            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 border border-red-100">
                <Loader2 size={16} className="animate-spin" /> {error}
              </div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-600 p-6 rounded-3xl mb-6 text-center border border-green-100 shadow-xl shadow-green-500/10"
              >
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex-center mx-auto mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-xl font-bold mb-1">Login Successful</h4>
                <p className="text-sm font-medium">{successMessage}</p>
                <p className="text-[10px] uppercase font-black mt-4 tracking-widest opacity-50">Redirecting to Dashboard...</p>
              </motion.div>
            )}

            {!successMessage && (
              <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-bold text-primary flex items-center gap-2">
                  <Mail size={16} /> Portal ID or Email
                </label>
                <input 
                  id="login-email"
                  name="email"
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. PPIS/2026/001 or name@peakpoint.edu" 
                  className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="text-sm font-bold text-primary flex items-center gap-2">
                    <Lock size={16} /> Password
                  </label>
                  <a href="#" className="text-xs font-bold text-secondary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    required
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
                <label htmlFor="remember" className="text-sm text-text-muted font-medium cursor-pointer">Remember me</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Log In'} <ShieldCheck size={20} />
              </button>
            </form>
            )}

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
