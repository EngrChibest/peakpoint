import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-16 h-16 flex-center">
                <img src={logo} alt="PPIS Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight font-baloo leading-tight">PEAK POINT INTERNATIONAL SCHOOLS</span>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed font-medium italic">
              "Raising Role Models with Excellence & Character"
            </p>
            <div className="flex gap-4">
              {/* Social icons temporarily removed */}
            </div>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/" className="text-white/60 hover:text-secondary">Home</Link></li>
              <li><Link to="/about" className="text-white/60 hover:text-secondary">About Us</Link></li>
              <li><Link to="/admissions" className="text-white/60 hover:text-secondary">Admissions</Link></li>
              <li><Link to="/academics" className="text-white/60 hover:text-secondary">Academics</Link></li>
              <li><Link to="/news" className="text-white/60 hover:text-secondary">News</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-secondary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6">Divisions</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-white/60 hover:text-secondary">Early Years</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary">Primary School</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary">Secondary School</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary">A-Levels</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 text-white/60">
                <MapPin className="text-secondary shrink-0" size={20} />
                <span>
                  12, Oluwaseyi Somorin Close,<br />
                  (Behind Afose House),<br />
                  Off Chijioke Onuoh street,<br />
                  Gbaga, Ikorodu,<br />
                  Lagos, Nigeria.
                </span>
              </li>
              <li className="flex gap-3 text-white/60">
                <Phone className="text-secondary shrink-0" size={20} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex gap-3 text-white/60">
                <Mail className="text-secondary shrink-0" size={20} />
                <span>info@peakpoint.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Peak Point International Schools. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/policies" className="hover:text-white">Policies & Safeguarding</Link>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
