import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, GraduationCap, Calendar, Clock, CheckCircle, ArrowRight, Upload, Info } from 'lucide-react';
import InnerBanner from '../components/layout/InnerBanner';
import applyBanner from '../assets/banners/apply.png';

const Apply = () => {
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  const nextStep = () => setFormStep(prev => prev + 1);
  const prevStep = () => setFormStep(prev => prev - 1);

  if (isSubmitted) {
    return (
      <div className="pt-20">
        <InnerBanner 
          title="Application Received" 
          subtitle="Thank you for choosing Peak Point International Schools."
          image={applyBanner}
        />
        <section className="section bg-bg-soft">
          <div className="container max-w-2xl text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-secondary/20">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl mb-4">Application Submitted!</h2>
              <p className="text-text-muted text-lg mb-8">
                Your application has been successfully submitted to our admissions office. 
                Our team will review the details and contact you via email within 2-3 business days.
              </p>
              <div className="bg-secondary/10 p-6 rounded-2xl mb-8 text-left">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <Info size={18} /> Next Steps:
                </h4>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>• Check your email for a confirmation message.</li>
                  <li>• Prepare original copies of the uploaded documents.</li>
                  <li>• An entrance assessment date will be scheduled shortly.</li>
                </ul>
              </div>
              <a href="/" className="btn btn-primary px-8">Return to Home</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <InnerBanner 
        title="Student Admission" 
        subtitle="Begin your journey toward excellence and character development."
        image={applyBanner}
      />

      <section className="section bg-bg-soft">
        <div className="container max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {['Student Info', 'Parent Info', 'History & Docs'].map((label, i) => (
                <div key={i} className="text-center">
                  <div className={`w-10 h-10 rounded-full flex-center mx-auto mb-2 font-bold transition-all ${formStep > i + 1 ? 'bg-green-500 text-white' : formStep === i + 1 ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white text-text-muted border'}`}>
                    {formStep > i + 1 ? <CheckCircle size={20} /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${formStep === i + 1 ? 'text-primary' : 'text-text-muted'}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden border">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((formStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-secondary/20">
            {formStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl mb-8 flex items-center gap-2 border-b pb-4">
                  <User className="text-secondary" /> Student Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">First Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Last Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Date of Birth</label>
                    <input type="date" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Gender</label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-text-muted">Grade/Class Applying For</label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft">
                      <option value="">Select Class</option>
                      <optgroup label="Primary School">
                        <option value="nursery">Nursery</option>
                        <option value="reception">Reception</option>
                        <option value="year1">Year 1</option>
                        <option value="year2">Year 2</option>
                        <option value="year3">Year 3</option>
                        <option value="year4">Year 4</option>
                        <option value="year5">Year 5</option>
                        <option value="year6">Year 6</option>
                      </optgroup>
                      <optgroup label="Secondary School">
                        <option value="js1">JS 1 (Year 7)</option>
                        <option value="js2">JS 2 (Year 8)</option>
                        <option value="js3">JS 3 (Year 9)</option>
                        <option value="ss1">SS 1 (Year 10)</option>
                        <option value="ss2">SS 2 (Year 11)</option>
                        <option value="ss3">SS 3 (Year 12)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <button type="button" onClick={nextStep} className="btn btn-primary px-10 py-4 group">
                    Next Step <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl mb-8 flex items-center gap-2 border-b pb-4">
                  <Phone className="text-secondary" /> Parent/Guardian Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Full Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Full name of parent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Relationship to Student</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="e.g. Father, Mother, Guardian" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Phone Number</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Email Address</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-text-muted">Residential Address</label>
                    <textarea rows="3" required className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter full residential address"></textarea>
                  </div>
                </div>
                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={prevStep} className="btn border border-primary text-primary px-8">Back</button>
                  <button type="button" onClick={nextStep} className="btn btn-primary px-10 py-4 group">
                    Next Step <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {formStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl mb-8 flex items-center gap-2 border-b pb-4">
                  <GraduationCap className="text-secondary" /> Academic History & Documents
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-text-muted">Previous School Attended</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Name of last school" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Last Grade Completed</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="e.g. Year 3" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-muted">Reason for Leaving</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Brief reason" />
                  </div>
                  
                  <div className="md:col-span-2 mt-4">
                    <label className="text-sm font-bold text-text-muted mb-4 block">Document Uploads (Scanned Copies)</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                        <Upload className="mx-auto mb-2 text-text-muted group-hover:text-primary" />
                        <span className="text-xs font-bold text-text-muted uppercase">Birth Certificate</span>
                      </div>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                        <Upload className="mx-auto mb-2 text-text-muted group-hover:text-primary" />
                        <span className="text-xs font-bold text-text-muted uppercase">Recent School Result</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={prevStep} className="btn border border-primary text-primary px-8">Back</button>
                  <button type="submit" className="btn btn-secondary px-12 py-4 shadow-lg text-lg">
                    Submit Application
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Info Card */}
          <div className="mt-12 bg-primary text-white p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white/20 p-4 rounded-full">
              <Clock size={32} className="text-secondary" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Application Processing Time</h4>
              <p className="text-white/80">
                Please note that processing an application typically takes 2-5 business days. 
                Once reviewed, you will be invited for an entrance interview and assessment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apply;
