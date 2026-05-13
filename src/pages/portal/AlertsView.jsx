import React from 'react';
import { 
  Bell, 
  Megaphone, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Check, 
  Loader2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AlertsView = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' };
      case 'warning': return { icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/5' };
      case 'announcement': return { icon: Megaphone, color: 'text-primary', bg: 'bg-primary/5', pulse: true };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[3rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 relative">
            <Bell size={28} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-primary text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">Notification Center</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Institutional Alerts & Announcements</p>
          </div>
        </div>
        <button 
          onClick={markAllAsRead}
          className="btn btn-outline py-3.5 px-8 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
        >
          <Check size={18} /> Mark All as Read
        </button>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/30 bg-bg-soft/30 flex-between items-center">
           <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              <ShieldCheck size={16} className="text-primary" /> Verified School Alerts
           </div>
           <p className="text-xs font-bold text-text-muted italic">{notifications.length} Total Messages</p>
        </div>

        <div className="divide-y divide-border/30">
          {notifications.map((n, i) => {
            const styles = getTypeStyles(n.type);
            const Icon = styles.icon;
            return (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-10 hover:bg-bg-soft/20 transition-all cursor-pointer relative group ${!n.read ? 'bg-secondary/5' : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>}
                
                <div className="flex gap-8 items-start">
                  <div className={`shrink-0 p-4 rounded-2xl ${styles.bg} ${styles.pulse ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform`}>
                    <Icon className={styles.color} size={28} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex-between items-start">
                      <p className={`text-lg leading-relaxed ${!n.read ? 'font-bold text-primary' : 'text-text-muted'}`}>
                        {n.message}
                      </p>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-text-muted/60 uppercase tracking-widest">
                        <Clock size={12} />
                        {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                        n.type === 'announcement' ? 'border-primary/20 text-primary bg-primary/5' : 'border-border text-text-muted'
                      }`}>
                        {n.type || 'System'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-40 text-center space-y-6 opacity-30">
               <Bell size={64} className="mx-auto" />
               <p className="text-xl font-medium italic">Your notification center is clear.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsView;
