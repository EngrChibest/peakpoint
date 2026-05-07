import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Sun, Moon } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const BookingModal = () => {
  const { isBookingOpen, closeBooking } = useModal();

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
          ></motion.div>

          {/* Modal Content - Small Form Panel */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden"
          >
            {/* Minimal Header */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-baloo font-bold text-primary">Book a Visit</h3>
                <p className="text-text-muted text-xs mt-1">Schedule your campus tour below.</p>
              </div>
              <button 
                onClick={closeBooking}
                className="w-8 h-8 bg-bg-soft hover:bg-secondary/20 rounded-full flex-center transition-all text-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Compact Form */}
            <form className="p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                  <input 
                    type="tel" 
                    placeholder="Enter phone" 
                    className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Preferred Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                  <input 
                    type="date" 
                    className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full py-4 rounded-xl text-md font-bold shadow-lg hover:shadow-xl transition-all mt-4">
                Request Visit
              </button>
              
              <p className="text-[9px] text-center text-text-muted px-4 leading-relaxed mt-2">
                We'll contact you shortly to confirm your session.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
