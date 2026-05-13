import React, { useState, useEffect } from 'react';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  Lock,
  Upload,
  Phone,
  Calendar,
  GraduationCap,
  MapPin,
  BookOpen,
  Clock,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSettings = () => {
  const { currentUser, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: ''
  });

  // Password Update State
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password should be at least 6 characters.", "error");
      return;
    }

    setIsUpdatingPass(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      showToast("Password updated successfully!", "success");
      setShowPassModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        showToast("Security: Please log out and log back in to change your password.", "error");
      } else {
        showToast("Error: " + err.message, "error");
      }
    } finally {
      setIsUpdatingPass(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFormData({
            fullName: data.fullName || '',
            email: data.displayEmail || data.email || '',
            avatar: data.avatar || '',
            phone: data.phone || '',
            address: data.address || '',
            dob: data.dob || '',
            gender: data.gender || '',
            qualification: data.qualification || ''
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        showToast("Image is too large. Please select an image under 500KB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        avatar: formData.avatar,
        phone: formData.phone || '',
        address: formData.address || '',
        dob: formData.dob || '',
        gender: formData.gender || '',
        qualification: formData.qualification || '',
        updatedAt: new Date().toISOString()
      };
      
      // Update display email if not a student (students have system emails)
      if (userData?.role !== 'student') {
        updateData.displayEmail = formData.email;
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updateData);
      
      // If student, also update student_data
      if (userData?.role === 'student') {
        await updateDoc(doc(db, 'student_data', currentUser.uid), {
          fullName: formData.fullName,
          avatar: formData.avatar,
          phone: formData.phone || '',
          address: formData.address || '',
          dob: formData.dob || '',
          gender: formData.gender || ''
        });
      }

      showToast("Profile updated successfully!", "success");
      await refreshUserData();
    } catch (err) {
      showToast("Error updating profile: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center flex-col gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-text-muted font-bold">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="h-48 bg-primary relative">
           <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/20 opacity-50"></div>
        </div>
        
        <div className="px-12 pb-12">
          <div className="relative -mt-24 mb-10 flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
              <img 
                src={formData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                alt="Profile" 
                className="w-48 h-48 rounded-[3.5rem] border-8 border-white bg-white shadow-2xl object-cover transition-transform group-hover:scale-[1.02]" 
              />
              <label className="absolute bottom-4 right-4 bg-primary text-white p-4 rounded-2xl shadow-xl cursor-pointer hover:bg-secondary transition-all hover:scale-110">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <Camera size={24} />
              </label>
            </div>
            
            <div className="flex-1 pb-4">
              <h2 className="text-3xl font-black text-primary mb-2">{formData.fullName}</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-bg-soft rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-border/50 flex items-center gap-2">
                  <Shield size={12} className="text-secondary" /> {userData?.role} Account
                </span>
                <span className="px-4 py-1.5 bg-bg-soft rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-border/50 flex items-center gap-2">
                  <User size={12} className="text-secondary" /> ID: {userData?.portalId}
                </span>
                {userData?.role === 'student' && userData?.classId && (
                  <span className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                    <BookOpen size={12} className="text-secondary" /> Class: {userData.classId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8 pt-8 border-t border-border/30">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    disabled={userData?.role === 'student'}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all ${userData?.role === 'student' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled={userData?.role === 'student'}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all ${userData?.role === 'student' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input 
                    type="date" 
                    value={formData.dob}
                    disabled={userData?.role === 'student'}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className={`w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all ${userData?.role === 'student' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-bg-soft border border-border/50 px-8 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {userData?.role !== 'student' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Academic Qualification</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                      type="text" 
                      value={formData.qualification}
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="e.g. B.Sc Education"
                      className="w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-4">Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-4 text-text-muted" size={20} />
                <textarea 
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-bg-soft border border-border/50 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-primary font-bold text-primary transition-all"
                ></textarea>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn btn-primary py-5 px-12 rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center gap-3 text-lg font-black tracking-wide disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                {isSaving ? 'Synchronizing...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-bg-soft rounded-3xl flex-center text-primary">
            <Lock size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary">Security & Password</h4>
            <p className="text-sm text-text-muted">Manage your portal access and authentication credentials.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPassModal(true)}
          className="btn btn-outline py-4 px-8 rounded-2xl font-bold"
        >
          Update Password
        </button>
      </div>

      {/* Password Update Modal */}
      <AnimatePresence>
        {showPassModal && (
          <div className="fixed inset-0 z-[110] flex-center bg-primary/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-bg-soft p-3 rounded-2xl text-primary">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Update Password</h3>
                </div>
                <button 
                  onClick={() => setShowPassModal(false)}
                  className="p-2 hover:bg-bg-soft rounded-xl text-text-muted transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest px-4">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-soft border border-border/50 pl-12 pr-12 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest px-4">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-soft border border-border/50 pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary"
                    />
                  </div>
                </div>

                <div className="bg-bg-soft p-4 rounded-2xl border border-border/50">
                  <p className="text-[10px] text-text-muted leading-relaxed italic">
                    Note: Your password must be at least 6 characters long. For security, you may be asked to re-login if your session has expired.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isUpdatingPass}
                  className="w-full btn btn-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex-center gap-3 disabled:opacity-50"
                >
                  {isUpdatingPass ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {isUpdatingPass ? 'Updating Credentials...' : 'Confirm Password Change'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSettings;
