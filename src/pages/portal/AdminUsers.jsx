import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  User, 
  GraduationCap, 
  X, 
  Loader2, 
  CheckCircle2, 
  Edit2, 
  Trash2,
  ChevronRight,
  Eye,
  FileText,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  where,
  getDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase Config for Secondary App (to create users without logout)
const firebaseConfig = {
  apiKey: "AIzaSyAwohrnvhNy2I6pJlATKM5QcH1RrJyHXHk",
  authDomain: "peak-point-school.firebaseapp.com",
  projectId: "peak-point-school",
  storageBucket: "peak-point-school.firebasestorage.app",
  messagingSenderId: "673758196786",
  appId: "1:673758196786:web:bcfd20e14bdd83a2d7782b",
};

const AVATAR_GALLERY = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace'
];

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('student'); // student, teacher, admin
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    portalId: '',
    classId: '',
    avatar: AVATAR_GALLERY[0],
    // Admission Style Fields
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    parentName: '',
    parentRelation: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    previousSchool: '',
    lastGrade: '',
    reasonForLeaving: '',
    status: 'Active'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', activeTab));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);

      const classSnap = await getDocs(collection(db, 'classes'));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = formData.role === 'student' ? `${formData.firstName} ${formData.lastName}` : formData.fullName;
      
      if (editingUser) {
        const updateData = {
          fullName,
          role: formData.role,
          portalId: formData.portalId,
          classId: formData.classId || '',
          avatar: formData.avatar,
          ...(formData.role === 'student' ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
          } : {
            displayEmail: formData.email
          })
        };

        await updateDoc(doc(db, 'users', editingUser.id), updateData);
        
        if (formData.role === 'student') {
          await setDoc(doc(db, 'student_data', editingUser.id), {
            ...formData,
            fullName,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } else {
        let loginEmail = formData.email;
        if (formData.role === 'student') {
          loginEmail = `${formData.portalId.replace(/\//g, '-').toLowerCase()}@peakpoint.edu`;
        }

        const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(firebaseConfig, "Secondary");
        const secondaryAuth = getAuth(secondaryApp);

        const res = await createUserWithEmailAndPassword(secondaryAuth, loginEmail, formData.password);
        const newUser = res.user;

        const userData = {
          uid: newUser.uid,
          fullName,
          email: loginEmail,
          displayEmail: formData.role === 'student' ? '' : formData.email,
          role: formData.role,
          portalId: formData.portalId,
          classId: formData.classId || '',
          avatar: formData.avatar,
          status: 'Active',
          createdAt: new Date().toISOString(),
          // Personal Details for all roles
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          dob: formData.dob || '',
          gender: formData.gender || '',
          phone: formData.role === 'student' ? formData.parentPhone : (formData.phone || ''),
          address: formData.address || '',
          qualification: formData.qualification || '',
        };

        await setDoc(doc(db, 'users', newUser.uid), userData);

        if (formData.role === 'student') {
          await setDoc(doc(db, 'student_data', newUser.uid), {
            ...formData,
            fullName,
            uid: newUser.uid,
            cgpa: '0.00',
            attendance: '100%',
            progress: '0%',
            feeStatus: 'Pending',
            createdAt: new Date().toISOString()
          });
        }

        await signOut(secondaryAuth);
      }

      showToast(editingUser ? 'User updated successfully!' : 'User created successfully!', "success");
      setShowModal(false);
      setEditingUser(null);
      fetchData();
    } catch (err) {
      showToast("Error saving user: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormStep(1);
    setFormData({
      fullName: '', email: '', password: '', role: activeTab, portalId: activeTab === 'student' ? 'PPIS/2026/' : '', classId: '',
      avatar: AVATAR_GALLERY[0], firstName: '', lastName: '', dob: '', gender: '',
      parentName: '', parentRelation: '', parentPhone: '', parentEmail: '', address: '',
      previousSchool: '', lastGrade: '', reasonForLeaving: '', status: 'Active',
      phone: '', qualification: ''
    });
  };

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

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (user) => {
    setEditingUser(user);
    if (user.role === 'student') {
      const studentSnap = await getDoc(doc(db, 'student_data', user.id));
      const studentData = studentSnap.exists() ? studentSnap.data() : {};
      setFormData({
        ...formData,
        ...user,
        ...studentData,
        email: user.displayEmail || user.email || '',
        role: 'student'
      });
    } else {
      setFormData({
        ...formData,
        ...user,
        email: user.displayEmail || user.email || '',
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
        gender: user.gender || '',
        qualification: user.qualification || ''
      });
    }
    setFormStep(1);
    setShowModal(true);
  };

  const openViewModal = async (user) => {
    if (user.role === 'student') {
      const studentSnap = await getDoc(doc(db, 'student_data', user.id));
      setViewingUser({ ...user, ...(studentSnap.exists() ? studentSnap.data() : {}) });
    } else {
      setViewingUser(user);
    }
    setShowViewModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Delete user record? (This won't delete Auth account)")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        if (activeTab === 'student') await deleteDoc(doc(db, 'student_data', userId));
        fetchData();
      } catch (err) { showToast(err.message, "error"); }
    }
  };

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (u.fullName?.toLowerCase() || '').includes(search) || (u.portalId?.toLowerCase() || '').includes(search);
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Tabs & Search */}
      <div className="bg-white p-8 rounded-[3rem] border border-border/50 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex bg-bg-soft p-1.5 rounded-[2rem] border border-border/30 w-full md:w-auto">
            {[
              { id: 'student', label: 'Students', icon: GraduationCap },
              { id: 'teacher', label: 'Teachers', icon: Briefcase },
              { id: 'admin', label: 'Admins', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-text-muted hover:text-primary'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}s...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-soft border border-border/50 pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-primary transition-all" 
              />
            </div>
            <button 
              onClick={openAddModal}
              className="btn btn-primary py-4 px-8 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 whitespace-nowrap"
            >
              <UserPlus size={20} /> Add {activeTab}
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-20 flex-center flex-col gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-text-muted font-bold">Synchronizing database...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((u) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={u.id} 
              className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <img src={u.avatar || AVATAR_GALLERY[0]} alt="" className="w-20 h-20 rounded-3xl object-cover bg-bg-soft border-4 border-white shadow-lg" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-md ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openViewModal(u)} className="p-3 bg-bg-soft text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Eye size={16} /></button>
                    <button onClick={() => openEditModal(u)} className="p-3 bg-bg-soft text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 size={16} /></button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-primary mb-1">{u.fullName}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{u.portalId || 'No ID'}</p>
                </div>

                <div className="pt-6 border-t border-border/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${activeTab === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-secondary/10 text-primary'}`}>
                      {activeTab === 'student' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      {activeTab === 'student' ? (classes.find(c => c.id === u.classId)?.name || 'Unassigned') : u.role}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal (Multi-step for students) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{editingUser ? 'Edit' : 'Register'} {activeTab}</h3>
                    {activeTab === 'student' && <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Step {formStep} of 3</p>}
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                {activeTab === 'student' ? (
                  <>
                    {formStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        {/* Avatar Selector */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Select Student Avatar</label>
                           <div className="flex flex-wrap gap-4 p-6 bg-bg-soft/50 rounded-[2.5rem] border border-border/30">
                              <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-primary/30 flex-center cursor-pointer hover:bg-primary/5 transition-all text-primary">
                                 <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                 <ImageIcon size={24} />
                              </label>
                              {AVATAR_GALLERY.map((av, i) => (
                                <button 
                                  key={i} 
                                  type="button" 
                                  onClick={() => setFormData({...formData, avatar: av})}
                                  className={`relative w-16 h-16 rounded-2xl overflow-hidden border-4 transition-all ${formData.avatar === av ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                  <img src={av} alt="" className="w-full h-full object-cover" />
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">First Name</label>
                            <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Last Name</label>
                            <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Portal ID / Reg No</label>
                            <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.portalId} onChange={e => setFormData({...formData, portalId: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Assigned Class</label>
                            <select required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
                              <option value="">Select Class</option>
                              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Date of Birth</label>
                            <input type="date" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Gender</label>
                            <select required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Parent/Guardian Name</label>
                            <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Relationship</label>
                            <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.parentRelation} onChange={e => setFormData({...formData, parentRelation: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Phone Number</label>
                            <input type="tel" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Email Address</label>
                            <input type="email" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Residential Address</label>
                            <textarea rows="3" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Previous School Attended</label>
                            <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.previousSchool} onChange={e => setFormData({...formData, previousSchool: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Last Grade Completed</label>
                            <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.lastGrade} onChange={e => setFormData({...formData, lastGrade: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Reason for Leaving</label>
                            <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.reasonForLeaving} onChange={e => setFormData({...formData, reasonForLeaving: e.target.value})} />
                          </div>
                          {!editingUser && (
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Set Portal Password</label>
                              <input type="password" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex-between pt-8 border-t border-border/30">
                      <button type="button" onClick={() => formStep > 1 ? setFormStep(prev => prev - 1) : setShowModal(false)} className="flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-all">
                        {formStep === 1 ? 'Cancel' : <><ArrowLeft size={18} /> Previous</>}
                      </button>
                      {formStep < 3 ? (
                        <button type="button" onClick={() => setFormStep(prev => prev + 1)} className="btn btn-primary py-4 px-10 rounded-2xl flex items-center gap-2 group">
                          Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary py-4 px-12 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                          {editingUser ? 'Update Student Record' : 'Confirm & Create Student'}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // Expanded Form for Teachers/Admins
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Full Name</label>
                        <input type="text" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Email Address</label>
                          <input type="email" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Phone Number</label>
                          <input type="tel" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Date of Birth</label>
                          <input type="date" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Gender</label>
                          <select className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Qualification</label>
                          <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" placeholder="e.g. B.Sc Education" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Portal ID / Staff ID</label>
                          <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.portalId} onChange={e => setFormData({...formData, portalId: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Residential Address</label>
                        <textarea rows="3" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Initial Password</label>
                          <input type="password" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        </div>
                      )}
                      <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex-center gap-3">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                        {editingUser ? 'Save Staff Changes' : `Register New ${activeTab}`}
                      </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal (Student File) */}
      <AnimatePresence>
        {showViewModal && viewingUser && (
          <div className="fixed inset-0 z-[110] flex-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowViewModal(false)} className="absolute inset-0 bg-primary/60 backdrop-blur-md"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-40 bg-primary relative">
                 <button onClick={() => setShowViewModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={28} /></button>
              </div>
              <div className="px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="-mt-16 relative z-10 flex flex-col items-center text-center space-y-4">
                  <img src={viewingUser.avatar || AVATAR_GALLERY[0]} alt="" className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-2xl bg-white object-cover" />
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{viewingUser.fullName}</h3>
                    <p className="text-xs font-black text-secondary uppercase tracking-[0.2em]">{viewingUser.portalId}</p>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8">
                  <div className="space-y-8">
                     <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><User size={12} /> Personal Details</h5>
                        <div className="space-y-4">
                           <div className="flex-between"><span className="text-xs font-bold text-text-muted">Gender</span><span className="text-xs font-black text-primary capitalize">{viewingUser.gender || 'N/A'}</span></div>
                           <div className="flex-between"><span className="text-xs font-bold text-text-muted">DOB</span><span className="text-xs font-black text-primary">{viewingUser.dob || 'N/A'}</span></div>
                           <div className="flex-between"><span className="text-xs font-bold text-text-muted">Status</span><span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-600">{viewingUser.status}</span></div>
                        </div>
                     </div>
                     <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={12} /> Address</h5>
                        <p className="text-xs font-bold text-primary leading-relaxed">{viewingUser.address || 'No address provided'}</p>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><GraduationCap size={12} /> {viewingUser.role === 'student' ? 'Academic' : 'Professional'}</h5>
                        <div className="space-y-4">
                           {viewingUser.role === 'student' ? (
                             <>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">Class</span><span className="text-xs font-black text-primary">{classes.find(c => c.id === viewingUser.classId)?.name || 'N/A'}</span></div>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">CGPA</span><span className="text-xs font-black text-secondary">{viewingUser.cgpa || '0.00'}</span></div>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">Attendance</span><span className="text-xs font-black text-primary">{viewingUser.attendance || '100%'}</span></div>
                             </>
                           ) : (
                             <>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">Role</span><span className="text-xs font-black text-primary capitalize">{viewingUser.role}</span></div>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">Joined</span><span className="text-xs font-black text-secondary">{new Date(viewingUser.createdAt).toLocaleDateString()}</span></div>
                               <div className="flex-between"><span className="text-xs font-bold text-text-muted">Qualification</span><span className="text-xs font-black text-primary">{viewingUser.qualification || 'N/A'}</span></div>
                             </>
                           )}
                        </div>
                     </div>
                     <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><Phone size={12} /> Contact</h5>
                        <div className="space-y-4">
                           <p className="text-xs font-bold text-primary truncate">{viewingUser.email}</p>
                           <p className="text-xs font-bold text-primary">{viewingUser.phone || viewingUser.parentPhone || 'N/A'}</p>
                        </div>
                     </div>
                  </div>
                </div>

                {viewingUser.role === 'student' && (
                  <div className="mt-12 p-8 bg-bg-soft rounded-[2rem] border border-border/50">
                    <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Emergency / Parent Information</h5>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex-center text-primary shadow-sm"><UserCircle size={24} /></div>
                      <div>
                        <p className="text-sm font-bold text-primary">{viewingUser.parentName || 'No parent info'}</p>
                        <p className="text-[10px] font-black text-text-muted uppercase">{viewingUser.parentRelation || 'Guardian'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
