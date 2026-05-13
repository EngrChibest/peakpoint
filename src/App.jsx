import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ModalProvider, useModal } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import BookingModal from './components/modals/BookingModal';
import { Calendar } from 'lucide-react';

import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import Facilities from './pages/Facilities';
import Policies from './pages/Policies';
import News from './pages/News';
import Login from './pages/Login';
import Apply from './pages/Apply';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PortalWrapper from './pages/PortalWrapper';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FloatingCTA = () => {
  const { openBooking } = useModal();
  return (
    <button 
      onClick={openBooking}
      className="fixed bottom-8 right-8 z-[90] bg-secondary text-primary p-4 pr-6 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 font-bold group"
    >
      <div className="bg-primary text-white p-2 rounded-full group-hover:rotate-12 transition-transform">
        <Calendar size={20} />
      </div>
      <span className="hidden md:inline">Book a Visit</span>
    </button>
  );
};

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPortalPage = location.pathname.startsWith('/portal');
  const hideLayout = isLoginPage || isPortalPage;

  return (
    <div className="app">
      {!hideLayout && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<Apply />} />

          {/* Portal Routes */}
          <Route path="/portal" element={<ProtectedRoute><Navigate to="/portal/student" replace /></ProtectedRoute>} />
          {/* Student Portal */}
          <Route path="/portal/student/:tab?" element={<ProtectedRoute allowedRoles={['student']}><PortalWrapper role="student" /></ProtectedRoute>} />
          
          {/* Teacher Portal */}
          <Route path="/portal/teacher/:tab?" element={<ProtectedRoute allowedRoles={['teacher']}><PortalWrapper role="teacher" /></ProtectedRoute>} />
          
          {/* Admin Portal */}
          <Route path="/portal/admin/:tab?" element={<ProtectedRoute allowedRoles={['admin']}><PortalWrapper role="admin" /></ProtectedRoute>} />

          {/* Parent Portal */}
          <Route path="/portal/parent/:tab?" element={<ProtectedRoute allowedRoles={['parent']}><PortalWrapper role="parent" /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <BookingModal />
      {!hideLayout && <FloatingCTA />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <ModalProvider>
            <Router>
              <ScrollToTop />
              <AppContent />
            </Router>
          </ModalProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
