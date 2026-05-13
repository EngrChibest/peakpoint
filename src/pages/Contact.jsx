import React, { useState } from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle, Loader2 } from 'lucide-react';
import bannerImg from '../assets/banners/contact.png';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

import { useNotifications } from '../context/NotificationContext';

const Contact = () => {
  const { notifyAdmins } = useNotifications();
  const [openFaq, setOpenFaq] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    { q: "What classes are available?", a: "Peak Point International Schools offers educational services across approved nursery, primary, and secondary levels." },
    { q: "Is admission currently ongoing?", a: "Admissions are open based on available spaces and approved academic sessions." },
    { q: "Does the school provide extracurricular activities?", a: "Yes. Learners participate in various clubs, sports, leadership, and creative activities." },
    { q: "Are qualified teachers available?", a: "Yes. The school engages qualified and experienced educators committed to learner development." },
    { q: "How can parents contact the school?", a: "Parents can contact the school through the official phone numbers, email, or school office." },
    { q: "Does the school emphasize moral and character development?", a: "Yes. Character formation, discipline, leadership, and moral values are part of the school’s educational philosophy." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      
      // Notify admins
      await notifyAdmins(
        `New Inquiry: ${formData.subject} from ${formData.name}`,
        'info',
        '/portal/admin/inquiries'
      );

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <InnerBanner 
        title="Contact Us" 
        subtitle="We're here to help. Reach out to us for any inquiries or to schedule a visit."
        image={bannerImg}
      />

      <section className="section">
        <div className="container">
          {/* Row 1: Get In Touch & Map */}
          <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <h3 className="text-3xl mb-8">Get In Touch</h3>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl h-fit">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-text-muted">+1 (234) 567-890</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl h-fit">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <p className="text-text-muted">info@peakpoint.edu</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl h-fit">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Address</h4>
                    <p className="text-text-muted">
                      12, Oluwaseyi Somorin Close,<br />
                      (Behind Afose House),<br />
                      Off Chijioke Onuoh street,<br />
                      Gbaga, Ikorodu,<br />
                      Lagos, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl h-fit">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Office Hours</h4>
                    <p className="text-text-muted">Mon - Fri: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Column */}
            <div className="h-[400px] bg-bg-soft rounded-3xl flex-center border border-dashed border-border overflow-hidden">
               <div className="text-center">
                <MapPin size={48} className="text-primary/20 mb-4 mx-auto" />
                <p className="text-text-muted font-bold">Google Maps Integration</p>
              </div>
            </div>
          </div>

          {/* Row 2: Send Us a Message & FAQ */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white p-10 rounded-3xl shadow-lg border">
              <h3 className="text-2xl mb-6">Send Us a Message</h3>
              
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                  <h4 className="text-xl font-bold text-primary mb-2">Message Sent!</h4>
                  <p className="text-text-muted mb-6">We have received your inquiry and will get back to you shortly.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-primary font-bold hover:underline">Send another message</button>
                </motion.div>
              ) : (
                <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-sm font-bold text-primary">Your Name</label>
                    <input id="contact-name" name="name" required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-sm font-bold text-primary">Email Address</label>
                    <input id="contact-email" name="email" required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-sm font-bold text-primary">Subject</label>
                    <input id="contact-subject" name="subject" required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Admission Inquiry" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-sm font-bold text-primary">Message</label>
                    <textarea id="contact-message" name="message" required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Your message here..." className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary py-4 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Column */}
            <div>
              <div className="mb-8">
                <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Got Questions?</span>
                <h3 className="text-3xl mb-4">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 group border-b border-border/50 overflow-hidden transition-all">
                      <button 
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full py-4 text-left flex justify-between items-center hover:opacity-80 transition-opacity"
                      >
                        <span className={`font-bold transition-colors ${openFaq === index ? 'text-secondary' : 'text-primary'}`}>
                          {faq.q}
                        </span>
                        <ChevronDown className={`text-secondary transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} size={16} />
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="pb-4 pt-0 text-text-muted text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
