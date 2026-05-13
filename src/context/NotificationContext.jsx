import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Listener 1: Personal Notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    // Listener 2: Global Announcements
    const aq = query(collection(db, 'announcements'), where('active', '==', true));

    let personalNotifs = [];
    let globalAnnouncements = [];

    const updateCombined = () => {
      const readAnnouncements = JSON.parse(localStorage.getItem(`read_announcements_${currentUser.uid}`) || '[]');
      const deletedAnnouncements = JSON.parse(localStorage.getItem(`deleted_announcements_${currentUser.uid}`) || '[]');
      
      const processedAnnouncements = globalAnnouncements
        .filter(a => !deletedAnnouncements.includes(a.id))
        .map(a => ({
          ...a,
          type: 'announcement',
          read: readAnnouncements.includes(a.id)
        }));

      const combined = [...personalNotifs, ...processedAnnouncements];
      // Sort in-memory
      combined.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setNotifications(combined);
      setUnreadCount(combined.filter(n => !n.read).length);
      setLoading(false);
    };

    const unsubNotifs = onSnapshot(q, (snapshot) => {
      personalNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateCombined();
    });

    const unsubAnnouncements = onSnapshot(aq, (snapshot) => {
      globalAnnouncements = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      }));
      updateCombined();
    });

    return () => {
      unsubNotifs();
      unsubAnnouncements();
    };
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      const notif = notifications.find(n => n.id === id);
      if (notif && notif.type === 'announcement') {
        const readKey = `read_announcements_${currentUser.uid}`;
        const readAnnouncements = JSON.parse(localStorage.getItem(readKey) || '[]');
        if (!readAnnouncements.includes(id)) {
          readAnnouncements.push(id);
          localStorage.setItem(readKey, JSON.stringify(readAnnouncements));
        }
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        await updateDoc(doc(db, 'notifications', id), { read: true });
      }
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    const unreadPersonal = notifications.filter(n => !n.read && n.type !== 'announcement');
    if (unreadPersonal.length > 0) {
      const batch = writeBatch(db);
      unreadPersonal.forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    }
    
    // Mark global announcements as read in localStorage
    const unreadAnnouncements = notifications.filter(n => !n.read && n.type === 'announcement');
    if (unreadAnnouncements.length > 0) {
      const readKey = `read_announcements_${currentUser.uid}`;
      const readAnnouncements = JSON.parse(localStorage.getItem(readKey) || '[]');
      unreadAnnouncements.forEach(a => {
        if (!readAnnouncements.includes(a.id)) readAnnouncements.push(a.id);
      });
      localStorage.setItem(readKey, JSON.stringify(readAnnouncements));
    }

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    try {
      const notif = notifications.find(n => n.id === id);
      if (notif && notif.type === 'announcement') {
        const deleteKey = `deleted_announcements_${currentUser.uid}`;
        const deletedAnnouncements = JSON.parse(localStorage.getItem(deleteKey) || '[]');
        if (!deletedAnnouncements.includes(id)) {
          deletedAnnouncements.push(id);
          localStorage.setItem(deleteKey, JSON.stringify(deletedAnnouncements));
        }
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        await deleteDoc(doc(db, 'notifications', id));
      }
    } catch (err) { console.error(err); }
  };

  const clearAllNotifications = async () => {
    try {
      const personalNotifs = notifications.filter(n => n.type !== 'announcement');
      if (personalNotifs.length > 0) {
        const batch = writeBatch(db);
        personalNotifs.forEach(n => {
          batch.delete(doc(db, 'notifications', n.id));
        });
        await batch.commit();
      }

      const globalAnnouncements = notifications.filter(n => n.type === 'announcement');
      if (globalAnnouncements.length > 0) {
        const deleteKey = `deleted_announcements_${currentUser.uid}`;
        const deletedAnnouncements = JSON.parse(localStorage.getItem(deleteKey) || '[]');
        globalAnnouncements.forEach(a => {
          if (!deletedAnnouncements.includes(a.id)) deletedAnnouncements.push(a.id);
        });
        localStorage.setItem(deleteKey, JSON.stringify(deletedAnnouncements));
      }

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const sendNotification = async (userId, message, type = 'info', link = null) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        message,
        type,
        link,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (err) { console.error(err); }
  };

  const notifyAdmins = async (message, type = 'info', link = null) => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'admin'));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      
      snap.docs.forEach(adminDoc => {
        const notifRef = doc(collection(db, 'notifications'));
        batch.set(notifRef, {
          userId: adminDoc.id,
          message,
          type,
          link,
          read: false,
          createdAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (err) { console.error(err); }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      markAsRead, 
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      sendNotification,
      notifyAdmins
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
