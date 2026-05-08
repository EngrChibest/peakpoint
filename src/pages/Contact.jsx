import React, { useState } from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from 'lucide-react';
import bannerImg from '../assets/banners/contact.png';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "What classes are available?", a: "Peak Point International Schools offers educational services across approved nursery, primary, and secondary levels." },
    { q: "Is admission currently ongoing?", a: "Admissions are open based on available spaces and approved academic sessions." },
    { q: "Does the school provide extracurricular activities?", a: "Yes. Learners participate in various clubs, sports, leadership, and creative activities." },
    { q: "Are qualified teachers available?", a: "Yes. The school engages qualified and experienced educators committed to learner development." },
    { q: "How can parents contact the school?", a: "Parents can contact the school through the official phone numbers, email, or school office." },
    { q: "Does the school emphasize moral and character development?", a: "Yes. Character formation, discipline, leadership, and moral values are part of the school’s educational philosophy." }
  ];

  return (
    <div className="contact-page">
      <InnerBanner 
        title="Contact Us" 
        subtitle="We're here to help. Reach out to us for any inquiries or to schedule a visit."
        image={bannerImg}
      />

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-1 flex flex-col gap-8">
              <div>
                <h3 className="text-2xl mb-8">Get In Touch</h3>
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
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-10 rounded-3xl shadow-lg border">
                <h3 className="text-2xl mb-6">Send Us a Message</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-primary">Your Name</label>
                    <input type="text" placeholder="John Doe" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-primary">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-primary">Subject</label>
                    <input type="text" placeholder="Admission Inquiry" className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-primary">Message</label>
                    <textarea rows="5" placeholder="Your message here..." className="bg-bg-soft border border-border p-4 rounded-xl outline-none focus:border-primary transition-all resize-none"></textarea>
                  </div>
                  <button type="button" className="btn btn-primary py-4 md:col-span-2 flex items-center justify-center gap-3">
                    Send Message <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-bg-soft">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Got Questions?</span>
            <h2 className="text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="flex gap-4 md:gap-6 items-start">
                {/* Number outside */}
                <div className="shrink-0 pt-5">
                  <span className="text-secondary font-black text-2xl md:text-3xl opacity-80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-1 group border-b border-border/50 overflow-hidden transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-6 text-left flex justify-between items-center hover:opacity-80 transition-opacity"
                  >
                    <span className={`font-bold text-lg pr-4 transition-colors ${openFaq === index ? 'text-secondary' : 'text-primary'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown className={`text-secondary transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pb-6 pt-0 text-text-muted text-lg leading-relaxed">
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
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-bg-soft flex-center">
        <div className="text-center">
          <MapPin size={48} className="text-primary/20 mb-4 mx-auto" />
          <p className="text-text-muted font-bold">Google Maps Integration Placeholder</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
