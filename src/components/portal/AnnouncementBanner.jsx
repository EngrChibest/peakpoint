import React, { useState, useEffect } from 'react';
import { Megaphone, X, Bell, Info } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedId, setDismissedId] = useState(localStorage.getItem('dismissedAnnouncement'));

  useEffect(() => {
    // Query for the latest active announcement
    const q = query(
      collection(db, 'announcements'),
      where('active', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort in-memory to avoid index requirement
        data.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        setAnnouncement(data[0]);
        // Show again if it's a new ID
        if (data[0].id !== dismissedId) {
          setIsVisible(true);
        }
      } else {
        setAnnouncement(null);
      }
    });

    return () => unsubscribe();
  }, [dismissedId]);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem('dismissedAnnouncement', announcement.id);
      setDismissedId(announcement.id);
      setIsVisible(false);
    }
  };

  if (!announcement || !isVisible) return null;

  const typeStyles = {
    info: 'bg-primary text-white',
    warning: 'bg-secondary text-primary',
    urgent: 'bg-red-600 text-white'
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`relative overflow-hidden ${typeStyles[announcement.type || 'info']}`}
      >
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Megaphone size={18} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <p className="text-sm font-bold tracking-tight">
                {announcement.title}
              </p>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full"></div>
              <p className="text-xs font-medium opacity-90">
                {announcement.content}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {announcement.link && (
              <a 
                href={announcement.link}
                className="hidden md:block text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
              >
                Learn More
              </a>
            )}
            <button 
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Animated Background Pulse */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
