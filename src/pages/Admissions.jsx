import React, { useState } from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { ClipboardCheck, Calendar, MapPin, CheckCircle, Download, HelpCircle, ChevronDown, Clock, Users, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useModal } from '../context/ModalContext';
import logo from '../assets/logo.png';

const Admissions = () => {
  const { openBooking } = useModal();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const steps = [
    { step: '01', title: 'Obtain Form', desc: 'Visit our campus or download the admission form online to begin.', icon: <Download size={24} /> },
    { step: '02', title: 'Submit Application', desc: 'Complete and submit the application form along with the necessary details.', icon: <FileText size={24} /> },
    { step: '03', title: 'Provide Documents', desc: 'Ensure all required documents are provided for the review process.', icon: <ClipboardCheck size={24} /> },
    { step: '04', title: 'Assessment', desc: 'Attend a scheduled assessment or interview for the prospective learner.', icon: <Calendar size={24} /> },
    { step: '05', title: 'Review & Approval', desc: 'The admissions committee will review the application for final approval.', icon: <CheckCircle size={24} /> },
    { step: '06', title: 'Payment of Fees', desc: 'Settle the required fees to secure the placement for the new session.', icon: <ClipboardCheck size={24} /> },
    { step: '07', title: 'Enrollment', desc: 'Welcome your child! Attend orientation and prepare for the first day.', icon: <Users size={24} /> },
  ];

  const faqs = [
    { q: "When does the admission session start?", a: "Our main academic session starts in September. however, we accept rolling admissions throughout the year depending on vacancy." },
    { q: "What is the minimum age for Creche?", a: "We welcome little ones from 3 months old in our Creche division." },
    { q: "Are there discounts for siblings?", a: "Yes, we offer a 10% discount on tuition fees for the third sibling and subsequent children from the same family." },
    { q: "Is there a school bus service?", a: "Absolutely. We provide safe and reliable transportation across major routes within the city." }
  ];

  return (
    <div className="admissions-page">
      <InnerBanner 
        title="Admissions" 
        subtitle="Start a transformative educational journey for your child today."
      />

      {/* Process Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">The Journey</span>
            <h2 className="text-4xl mb-4">Our Admission Process</h2>
            <p className="text-text-muted text-lg">
              We've streamlined our process to be as welcoming and transparent as possible for every family.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {steps.map((item, i) => (
              <div key={i} className="group relative p-8 bg-white border border-border/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="text-7xl font-black text-primary/5 absolute top-4 right-4 group-hover:text-secondary/10 transition-colors">{item.step}</div>
                <div className="bg-primary/5 text-primary p-4 rounded-2xl w-fit mb-6 group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <button className="btn btn-secondary px-12 py-5 text-lg shadow-xl hover:scale-105 transition-transform">
              Enrol Now
            </button>
          </div>
        </div>
      </section>

      {/* Downloads & Requirements */}
      <section className="section bg-bg-soft">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl mb-8">Required Documents</h2>
              <div className="space-y-6">
                {[
                  { title: 'Passport Photographs', desc: 'Clear passport-sized photographs of the prospective learner.' },
                  { title: 'Birth Certificate', desc: 'Official copy of the child\'s birth certificate for age verification.' },
                  { title: 'Academic Records', desc: 'Previous academic reports and records from former schools.' },
                  { title: 'Immunization Record', desc: 'Health and immunization records (if required for placement).' },
                  { title: 'Guardian Information', desc: 'Full contact details and identification of parents or guardians.' }
                ].map((req, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1"><CheckCircle className="text-secondary" size={20} /></div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{req.title}</h4>
                      <p className="text-text-muted text-sm">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-white rounded-3xl border border-border/50 shadow-sm">
                 <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <Download size={20} className="text-secondary" /> Download Resources
                 </h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="/downloads/placeholder.pdf" download="PPIS_Application_Form.pdf" className="flex items-center justify-between p-4 bg-bg-soft rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm font-bold">
                       Application Form <FileText size={18} />
                    </a>
                    <a href="/downloads/placeholder.pdf" download="PPIS_Medical_Form.pdf" className="flex items-center justify-between p-4 bg-bg-soft rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm font-bold">
                       Medical Fitness Form <FileText size={18} />
                    </a>
                    <a href="/downloads/placeholder.pdf" download="PPIS_Prospectus.pdf" className="flex items-center justify-between p-4 bg-bg-soft rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm font-bold">
                       School Prospectus <FileText size={18} />
                    </a>
                    <a href="/downloads/placeholder.pdf" download="PPIS_Uniform_Policy.pdf" className="flex items-center justify-between p-4 bg-bg-soft rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm font-bold">
                       Uniform Policy <FileText size={18} />
                    </a>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
               <div className="bg-primary p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Age Requirements</h3>
                  <p className="text-white/70 text-sm">Guidelines for class placement based on age.</p>
               </div>
               <div className="p-0 overflow-x-auto">
                   <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-bg-soft border-b border-border">
                        <th className="p-6 font-bold text-primary">Class Level</th>
                        <th className="p-6 font-bold text-primary">Recommended Age</th>
                        <th className="p-6 font-bold text-primary">Admission Requirement</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { level: 'Creche', age: '1–2 Years', req: 'Basic interview with parents' },
                        { level: 'Nursery 1', age: '2–3 Years', req: 'Simple assessment' },
                        { level: 'Nursery 2', age: '3–4 Years', req: 'Simple assessment' },
                        { level: 'Kindergarten', age: '4–5 Years', req: 'Readiness assessment' },
                        { level: 'Primary 1', age: '5–6 Years', req: 'Entrance assessment' },
                        { level: 'Primary 2–5', age: 'Appropriate age', req: 'Previous school records' },
                        { level: 'JSS 1', age: '10–12 Years', req: 'Entrance examination' },
                        { level: 'JSS 2–SSS', age: 'Appropriate age', req: 'Transfer records & assessment' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-secondary/5 transition-colors">
                          <td className="p-6 font-semibold">{row.level}</td>
                          <td className="p-6">{row.age}</td>
                          <td className="p-6">{row.req}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="p-8 bg-secondary/10">
                  <p className="text-xs text-text-muted leading-relaxed">
                    *Note: Students must have reached the minimum age by August 31st of the entry year. Final placement is subject to academic assessment results.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Final CTA */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Common Questions</span>
              <h2 className="text-4xl mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start">
                    {/* Number outside */}
                    <div className="shrink-0 pt-5">
                      <span className="text-secondary font-black text-2xl md:text-3xl opacity-80">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex-1 group border-b border-border/50 overflow-hidden transition-all">
                      <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full py-6 text-left flex justify-between items-center hover:opacity-80 transition-opacity"
                      >
                        <span className="font-bold text-primary pr-4 text-lg">{faq.q}</span>
                        <ChevronDown className={`text-secondary transition-transform duration-300 shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} size={20} />
                      </button>
                      <AnimatePresence>
                        {activeFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="pb-6 pt-0 text-text-muted leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-bg-soft rounded-2xl flex items-center gap-4 border border-border/50">
                 <div className="w-12 h-12 rounded-full bg-white flex-center shadow-sm">
                    <HelpCircle className="text-secondary" />
                 </div>
                 <div>
                    <p className="font-bold text-primary">Have more questions?</p>
                    <p className="text-sm text-text-muted">Contact our support team at info@peakpointschools.com</p>
                 </div>
              </div>
            </div>

            <div className="bg-primary text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute top-0 right-0 w-80 h-80 bg-secondary opacity-10 blur-3xl -mr-40 -mt-40"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent opacity-5 blur-3xl -ml-40 -mb-40"></div>
               
               <div className="relative z-10 w-full">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex-center mb-6 mx-auto border border-white/20 shadow-xl overflow-hidden p-3">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Peak Point Family?</h2>
                 <p className="text-white/70 mb-10 leading-relaxed max-w-md mx-auto">
                   We invite you to take the first step towards a bright future for your child. Visit us today or start your application online.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                    <button className="btn btn-secondary px-10 py-5 text-lg shadow-[0_10px_30px_-10px_rgba(240,225,185,0.5)] hover:scale-105 transition-transform">
                      Enrol Now
                    </button>
                    <button 
                      onClick={openBooking}
                      className="btn border-2 border-white/20 hover:bg-white/10 text-white px-10 py-5 text-lg"
                    >
                      Book a School Visit
                    </button>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary/20 p-2 rounded-lg text-secondary"><Users size={20} /></div>
                      <div className="text-left">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold leading-none">Admissions</p>
                        <p className="font-bold text-white/90">+234 800 PEAK POINT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary/20 p-2 rounded-lg text-secondary"><Clock size={20} /></div>
                      <div className="text-left">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold leading-none">Office Hours</p>
                        <p className="font-bold text-white/90">8 AM - 4 PM</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
