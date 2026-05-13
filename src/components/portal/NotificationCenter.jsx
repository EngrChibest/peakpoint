import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Info, AlertTriangle, CheckCircle2, Megaphone } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
      setIsOpen(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-secondary" size={18} />;
      case 'announcement': return <Megaphone className="text-primary animate-pulse" size={18} />;
      default: return <Info className="text-primary" size={18} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white border border-border/50 rounded-xl hover:bg-bg-soft transition-all group"
      >
        <Bell size={20} className="text-text-muted group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-secondary text-primary text-[10px] font-black rounded-full flex-center border-2 border-white -translate-y-1 translate-x-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden z-[100]"
          >
            <div className="p-6 border-b border-border/30 flex-between items-center bg-bg-soft/30">
              <h4 className="font-bold text-primary flex items-center gap-2">
                Notifications
                {unreadCount > 0 && <span className="bg-secondary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </h4>
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-border/30 custom-scrollbar">
              {notifications.length > 0 ? notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-6 hover:bg-bg-soft/30 transition-all cursor-pointer relative group ${!n.read ? 'bg-secondary/5' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1 pr-6">
                      <p className={`text-sm leading-snug ${!n.read ? 'font-bold text-primary' : 'text-text-muted'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] font-bold text-text-muted/60 uppercase tracking-wider">
                        {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {!n.read && (
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                        className="p-1.5 text-text-muted/40 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center space-y-3 opacity-50">
                  <Bell size={48} className="mx-auto text-text-muted" />
                  <p className="text-sm font-medium">No notifications yet.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 bg-bg-soft/20 flex items-center justify-between border-t border-border/30 px-6">
                <button 
                  onClick={clearAllNotifications}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => { navigate('/portal/admin/alerts'); setIsOpen(false); }} 
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  View History
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
