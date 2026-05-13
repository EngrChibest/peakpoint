import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwohrnvhNy2I6pJlATKM5QcH1RrJyHXHk",
  authDomain: "peak-point-school.firebaseapp.com",
  projectId: "peak-point-school",
  storageBucket: "peak-point-school.firebasestorage.app",
  messagingSenderId: "673758196786",
  appId: "1:673758196786:web:bcfd20e14bdd83a2d7782b",
  measurementId: "G-1WT3830WX1"
};

// Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);

export default app;
