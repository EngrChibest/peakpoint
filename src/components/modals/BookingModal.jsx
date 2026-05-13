import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNotifications } from '../../context/NotificationContext';

const BookingModal = () => {
  const { isBookingOpen, closeBooking } = useModal();
  const { notifyAdmins } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to inquiries collection
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        type: 'visit_request',
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Notify Admins
      await notifyAdmins(
        `New Visit Request from ${formData.fullName}`, 
        'info', 
        '/portal/admin/inquiries'
      );

      setSuccess(true);
      setTimeout(() => {
        closeBooking();
        setSuccess(false);
        setFormData({ fullName: '', email: '', phone: '', date: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
          ></motion.div>

          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden"
          >
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

            {success ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-primary">Request Sent!</h4>
                <p className="text-sm text-text-muted">We've received your booking. Our admissions team will contact you shortly.</p>
              </div>
            ) : (
              <form className="p-8 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label htmlFor="booking-fullName" className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                    <input 
                      id="booking-fullName"
                      name="fullName"
                      required
                      type="text" 
                      placeholder="Enter name" 
                      className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="booking-email" className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                    <input 
                      id="booking-email"
                      name="email"
                      required
                      type="email" 
                      placeholder="Enter email" 
                      className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="booking-phone" className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                    <input 
                      id="booking-phone"
                      name="phone"
                      required
                      type="tel" 
                      placeholder="Enter phone" 
                      className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="booking-date" className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Preferred Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-secondary transition-colors" size={16} />
                    <input 
                      id="booking-date"
                      name="date"
                      required
                      type="date" 
                      className="w-full bg-bg-soft border-2 border-transparent p-3.5 pl-11 rounded-xl outline-none focus:border-secondary/30 focus:bg-white transition-all text-sm"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="btn btn-primary w-full py-4 rounded-xl text-md font-bold shadow-lg hover:shadow-xl transition-all mt-4 flex-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Request Visit'}
                </button>
                
                <p className="text-[9px] text-center text-text-muted px-4 leading-relaxed mt-2">
                  We'll contact you shortly to confirm your session.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
