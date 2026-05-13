import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, User, Menu, LogOut, ChevronDown, Mail } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = ({ title, user, onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-bg-soft rounded-xl text-primary transition-colors shrink-0"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-bold text-primary truncate">{title}</h2>
          <p className="text-[10px] md:text-xs text-text-muted font-medium truncate hidden sm:block">Welcome, {user.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden xl:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-bg-soft border border-border/50 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <NotificationCenter />
          
          <div className="h-8 w-px bg-border mx-1 md:mx-2"></div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 hover:bg-bg-soft rounded-2xl transition-all group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-primary leading-none">{user.name}</p>
                <p className="text-[9px] md:text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">{user.role}</p>
              </div>
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary text-white flex-center font-bold shadow-lg shadow-primary/20 overflow-hidden group-hover:scale-105 transition-transform">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0)
                )}
              </div>
              <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-border/50 overflow-hidden z-[100]"
                >
                  <div className="p-5 bg-bg-soft/30 border-b border-border/30">
                    <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Account</p>
                    <p className="font-bold text-primary truncate">{user.name}</p>
                    <p className="text-[10px] text-text-muted font-medium truncate">{user.email || user.id}</p>
                  </div>

                  <div className="p-2">
                    <button 
                      onClick={() => { setIsProfileOpen(false); /* Navigate to profile */ }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-text-muted hover:bg-bg-soft hover:text-primary transition-all"
                    >
                      <User size={18} /> Profile Settings
                    </button>
                    <button 
                      onClick={() => { setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-text-muted hover:bg-bg-soft hover:text-primary transition-all"
                    >
                      <Settings size={18} /> Preferences
                    </button>
                    
                    <div className="h-px bg-border/50 my-2 mx-3"></div>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={18} /> Secure Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
