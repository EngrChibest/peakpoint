import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MoreVertical,
  Loader2,
  Mail,
  Phone,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';

const firebaseConfig = {
  apiKey: "AIzaSyAwohrnvhNy2I6pJlATKM5QcH1RrJyHXHk",
  authDomain: "peak-point-school.firebaseapp.com",
  projectId: "peak-point-school",
  storageBucket: "peak-point-school.firebasestorage.app",
  messagingSenderId: "673758196786",
  appId: "1:673758196786:web:bcfd20e14bdd83a2d7782b",
};

const AdminApplications = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setApplications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveAdmission = async (app) => {
    if (!window.confirm(`Approve admission for ${app.fullName} and create student portal account?`)) return;
    
    setIsProcessing(true);
    try {
      // 1. Generate Portal ID
      const year = new Date().getFullYear();
      const countSnap = await getDocs(collection(db, 'users'));
      const studentCount = countSnap.docs.filter(d => d.data().role === 'student').length + 1;
      const portalId = `PPIS/${year}/${studentCount.toString().padStart(3, '0')}`;
      const loginEmail = `${portalId.replace(/\//g, '-').toLowerCase()}@peakpoint.edu`;
      
      // Generate default password: LastName + ppis
      const nameParts = app.fullName?.trim().split(/\s+/) || [];
      const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1].toLowerCase() : 'student';
      const defaultPassword = `${lastName}ppis`;

      // 2. Create Firebase Auth Account (using secondary app to avoid logging out admin)
      const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);
      const res = await createUserWithEmailAndPassword(secondaryAuth, loginEmail, defaultPassword);
      const newUser = res.user;

      // 3. Create User Record (Unified Profile)
      const userData = {
        uid: newUser.uid,
        fullName: app.fullName,
        firstName: app.firstName || '',
        lastName: app.lastName || '',
        email: loginEmail,
        displayEmail: '',
        role: 'student',
        portalId: portalId,
        classId: app.grade?.replace(/\s+/g, '-').toLowerCase() || '',
        dob: app.dob || '',
        gender: app.gender || '',
        phone: app.parentPhone || '',
        address: app.address || '',
        parentName: app.parentName || '',
        parentRelation: app.parentRelation || '',
        parentPhone: app.parentPhone || '',
        parentEmail: app.parentEmail || '',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', newUser.uid), userData);

      // 4. Create Student Data Record (Detailed Profile)
      await setDoc(doc(db, 'student_data', newUser.uid), {
        ...userData,
        previousSchool: app.previousSchool || '',
        lastGrade: app.lastGrade || '',
        reasonForLeaving: app.reasonForLeaving || '',
        cgpa: '0.00',
        attendance: '100%',
        progress: '0%',
        feeStatus: 'Pending',
        admissionSource: app.id,
        updatedAt: new Date().toISOString()
      });

      // 5. Update Application Status
      await updateDoc(doc(db, 'applications', app.id), { 
        status: 'approved',
        processedAt: new Date().toISOString(),
        assignedPortalId: portalId
      });

      await signOut(secondaryAuth);
      fetchData();
      setSelectedApp(null);
      showToast(`Admission approved! Student ID: ${portalId}. Login: ${loginEmail}`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
      fetchData();
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) { showToast(err.message, "error"); }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Rejected</span>;
      case 'interview': return <span className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">Interview</span>;
      default: return <span className="bg-bg-soft text-text-muted px-3 py-1 rounded-full text-[10px] font-bold uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-primary">Student Admissions</h2>
          <p className="text-sm text-text-muted font-medium mt-1">Review and process incoming student applications.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-border/50 pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-primary transition-all shadow-sm w-64"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-border/50 px-6 py-3 rounded-2xl outline-none focus:border-primary shadow-sm font-bold text-sm text-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <th className="px-8 py-6">Student</th>
                    <th className="px-8 py-6">Grade</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className={`hover:bg-bg-soft/30 transition-colors cursor-pointer group ${selectedApp?.id === app.id ? 'bg-bg-soft' : ''}`} onClick={() => setSelectedApp(app)}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex-center font-bold group-hover:bg-primary group-hover:text-white transition-all">
                            {app.fullName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{app.fullName}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{app.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-primary">{app.grade}</td>
                      <td className="px-8 py-6 text-xs text-text-muted font-medium">
                        {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-6">{getStatusBadge(app.status)}</td>
                      <td className="px-8 py-6 text-right"><MoreVertical size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" /></td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr><td colSpan="5" className="p-24 text-center text-text-muted italic opacity-50">No applications found in the records.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm p-8 h-fit sticky top-8">
          {selectedApp ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="h-24 w-24 rounded-[2rem] bg-bg-soft text-primary flex-center mx-auto mb-4 text-3xl font-black shadow-inner">
                  {selectedApp.fullName?.[0]}
                </div>
                <h3 className="text-xl font-bold text-primary">{selectedApp.fullName}</h3>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2">Class: {selectedApp.grade}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-bg-soft rounded-3xl border border-border/30">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Status</p>
                  <p className="text-sm font-black text-primary capitalize">{selectedApp.status}</p>
                </div>
                <div className="p-5 bg-bg-soft rounded-3xl border border-border/30">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">DOB</p>
                  <p className="text-sm font-black text-primary">{selectedApp.dob}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest border-b border-border/30 pb-2">
                   <ShieldCheck size={16} /> Contact Information
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="p-2.5 bg-bg-soft rounded-xl text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                       <Mail size={16} />
                    </div>
                    <span className="text-sm font-bold text-primary/70">{selectedApp.parentEmail}</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-2.5 bg-bg-soft rounded-xl text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                       <Phone size={16} />
                    </div>
                    <span className="text-sm font-bold text-primary/70">{selectedApp.parentPhone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/30">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Administrative Actions</p>
                <div className="grid grid-cols-1 gap-3">
                  {selectedApp.status !== 'approved' && (
                    <>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleApproveAdmission(selectedApp)} 
                        className="w-full btn btn-primary py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex-center gap-3"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                        Approve & Create Account
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => updateStatus(selectedApp.id, 'interview')} className="btn btn-outline py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Interview</button>
                        <button onClick={() => updateStatus(selectedApp.id, 'rejected')} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Reject</button>
                      </div>
                    </>
                  )}
                  {selectedApp.status === 'approved' && (
                    <div className="p-6 bg-green-50 border border-green-100 rounded-3xl text-center space-y-2">
                       <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Admission Finalized</p>
                       <p className="text-sm font-bold text-green-900">Student ID: {selectedApp.assignedPortalId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex-center flex-col text-center space-y-6 opacity-30 italic">
              <FileText size={64} className="text-text-muted" />
              <p className="text-lg font-medium">Select an application to begin the institutional review process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
