import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Calendar } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import logo from '../../assets/logo.png';

const Header = () => {
  const { openBooking } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container flex-between">
        <Link to="/" className="flex-center gap-2">
          <div className="w-12 h-12 flex-center">
            <img src={logo} alt="PPIS Logo" className="w-full h-full object-contain" />
          </div>
          <div className={`flex flex-col font-baloo transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>
            <span className="font-bold text-xl tracking-tight leading-none whitespace-nowrap">PEAK POINT</span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap -mt-1">Int'l Schools</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>Home</Link>
          <Link to="/about" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>About</Link>
          <Link to="/admissions" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>Admissions</Link>
          <Link to="/academics" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 flex items-center gap-1 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>
            Academics <ChevronDown size={16} />
          </Link>
          <Link to="/facilities" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>Campus Life</Link>
          <Link to="/news" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>News</Link>
          <Link to="/contact" className={`font-semibold transition-colors hover:underline underline-offset-4 hover:opacity-80 ${isScrolled ? 'text-primary' : 'text-secondary'}`}>Contact Us</Link>
          <Link to="/portal" className="btn btn-primary text-sm px-6">
            <User size={16} /> Portal
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${isScrolled ? 'text-primary' : 'text-secondary'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl p-6 border-t animate-in slide-in-from-top duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <Link to="/" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/admissions" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>Admissions</Link>
            <Link to="/academics" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>Academics</Link>
            <Link to="/facilities" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>Campus Life</Link>
            <Link to="/news" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>News</Link>
            <Link to="/contact" className="font-semibold text-lg text-text hover:text-primary hover:underline underline-offset-4 transition-colors" onClick={() => setIsOpen(false)}>Contact Us</Link>
            <Link to="/portal" className="btn btn-primary w-full max-w-[200px] mt-2 justify-center" onClick={() => setIsOpen(false)}>
              <User size={18} /> Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
