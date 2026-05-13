import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUserData() {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setUserData(null);
    return signOut(auth);
  }

  async function signup(email, password, role, extraData) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Create user document in Firestore
    const newUserData = {
      uid: user.uid,
      email,
      role,
      ...extraData,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), newUserData);
    setUserData(newUserData);
    return res;
  }

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      // 5 minutes = 300,000 ms
      inactivityTimer = setTimeout(() => {
        if (auth.currentUser) {
          console.log("Inactivity detected. Logging out...");
          logout();
        }
      }, 300000); 
    };

    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Listen for common user activities
    if (currentUser) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
      resetInactivityTimer();
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userData,
    userRole: userData?.role,
    login,
    logout,
    signup,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
