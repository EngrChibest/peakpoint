import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Upload, 
  Info,
  Loader2
} from 'lucide-react';
import InnerBanner from '../components/layout/InnerBanner';
import applyBanner from '../assets/banners/apply.png';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';

const Apply = () => {
  const { notifyAdmins } = useNotifications();
  const { showToast } = useToast();
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    grade: '',
    parentName: '',
    parentRelation: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    previousSchool: '',
    lastGrade: '',
    reasonForLeaving: '',
    status: 'pending'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await addDoc(collection(db, 'applications'), {
        ...formData,
        fullName,
        createdAt: serverTimestamp(),
      });

      // Notify admins
      await notifyAdmins(
        `New Student Application: ${fullName} (${formData.grade})`,
        'info',
        '/portal/admin/applications'
      );

      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      showToast("Error submitting application: " + err.message, "error");
    } finally {
      setLoading(false);
    }
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
                    <label htmlFor="student-firstName" className="text-sm font-bold text-text-muted">First Name</label>
                    <input id="student-firstName" type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="student-lastName" className="text-sm font-bold text-text-muted">Last Name</label>
                    <input id="student-lastName" type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="student-dob" className="text-sm font-bold text-text-muted">Date of Birth</label>
                    <input id="student-dob" type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="student-gender" className="text-sm font-bold text-text-muted">Gender</label>
                    <select id="student-gender" name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="student-grade" className="text-sm font-bold text-text-muted">Grade/Class Applying For</label>
                    <select id="student-grade" name="grade" required value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft">
                      <option value="">Select Class</option>
                      <optgroup label="Primary School">
                        <option value="Nursery">Nursery</option>
                        <option value="Reception">Reception</option>
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                        <option value="Year 5">Year 5</option>
                        <option value="Year 6">Year 6</option>
                      </optgroup>
                      <optgroup label="Secondary School">
                        <option value="JSS 1">JSS 1 (Year 7)</option>
                        <option value="JSS 2">JSS 2 (Year 8)</option>
                        <option value="JSS 3">JSS 3 (Year 9)</option>
                        <option value="SS 1">SS 1 (Year 10)</option>
                        <option value="SS 2">SS 2 (Year 11)</option>
                        <option value="SS 3">SS 3 (Year 12)</option>
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
                    <label htmlFor="parent-fullName" className="text-sm font-bold text-text-muted">Full Name</label>
                    <input id="parent-fullName" type="text" name="parentName" required value={formData.parentName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Full name of parent" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="parent-relation" className="text-sm font-bold text-text-muted">Relationship to Student</label>
                    <input id="parent-relation" type="text" name="parentRelation" required value={formData.parentRelation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="e.g. Father, Mother, Guardian" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="parent-phone" className="text-sm font-bold text-text-muted">Phone Number</label>
                    <input id="parent-phone" type="tel" name="parentPhone" required value={formData.parentPhone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="parent-email" className="text-sm font-bold text-text-muted">Email Address</label>
                    <input id="parent-email" type="email" name="parentEmail" required value={formData.parentEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="parent-address" className="text-sm font-bold text-text-muted">Residential Address</label>
                    <textarea id="parent-address" rows="3" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Enter full residential address"></textarea>
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
                    <label htmlFor="history-previousSchool" className="text-sm font-bold text-text-muted">Previous School Attended</label>
                    <input id="history-previousSchool" type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Name of last school" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="history-lastGrade" className="text-sm font-bold text-text-muted">Last Grade Completed</label>
                    <input id="history-lastGrade" type="text" name="lastGrade" value={formData.lastGrade} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="e.g. Year 3" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="history-reasonForLeaving" className="text-sm font-bold text-text-muted">Reason for Leaving</label>
                    <input id="history-reasonForLeaving" type="text" name="reasonForLeaving" value={formData.reasonForLeaving} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all bg-bg-soft" placeholder="Brief reason" />
                  </div>
                  
                  <div className="md:col-span-2 mt-4 text-center p-8 bg-bg-soft border-2 border-dashed border-border rounded-2xl">
                    <Upload className="mx-auto mb-4 text-primary" size={32} />
                    <p className="text-sm font-bold text-primary mb-1">Documentation Requirement</p>
                    <p className="text-xs text-text-muted">Please bring original Birth Certificate and last School Results during your entrance interview.</p>
                  </div>
                </div>
                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={prevStep} className="btn border border-primary text-primary px-8">Back</button>
                  <button type="submit" disabled={loading} className="btn btn-secondary px-12 py-4 shadow-lg text-lg flex items-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
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
