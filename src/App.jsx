import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ModalProvider, useModal } from './context/ModalContext';
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

  return (
    <div className="app">
      {!isLoginPage && <Header />}
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
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
      <BookingModal />
      {!isLoginPage && <FloatingCTA />}
    </div>
  );
}

function App() {
  return (
    <ModalProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ModalProvider>
  );
}

export default App;
