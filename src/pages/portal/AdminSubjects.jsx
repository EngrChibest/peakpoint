import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Loader2, 
  CheckCircle2, 
  X,
  Layers,
  GraduationCap,
  Users
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', department: 'General', description: '' });

  const departments = ['Nursery', 'Primary', 'Secondary', 'Science', 'Arts', 'Commercial', 'General'];

  useEffect(() => {
    const q = query(collection(db, 'subjects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateDoc(doc(db, 'subjects', editingSubject.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'subjects'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ name: '', code: '', department: 'General', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubject = async (id) => {
    if (window.confirm('Delete this subject? This may affect timetables and assessments.')) {
      await deleteDoc(doc(db, 'subjects', id));
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-8 rounded-[3rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">Subject Registry</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Academic Curriculum Management</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingSubject(null); setFormData({ name: '', code: '', department: 'General', description: '' }); setShowModal(true); }}
          className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> Add New Subject
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {['Primary', 'Secondary', 'Science', 'Arts'].map((dept, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex-between items-center">
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{dept}</p>
                <p className="text-xl font-black text-primary">{subjects.filter(s => s.department === dept).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-bg-soft flex-center text-primary">
                 <Layers size={18} />
              </div>
           </div>
         ))}
      </div>

      {/* Subject List */}
      <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/30 bg-bg-soft/30 flex-between items-center">
           <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              <GraduationCap size={16} className="text-primary" /> Active Curriculum
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Subject Detail</th>
                <th className="px-10 py-6">Code</th>
                <th className="px-10 py-6">Department</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-bg-soft/20 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-bg-soft flex-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-primary text-lg">{s.name}</p>
                        <p className="text-xs text-text-muted">{s.description || 'No description provided'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs font-black text-primary bg-bg-soft px-4 py-1.5 rounded-full uppercase tracking-widest">{s.code || 'N/A'}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{s.department}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingSubject(s); setFormData({ ...s }); setShowModal(true); }} className="p-3 rounded-xl bg-bg-soft text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 size={18} /></button>
                      <button onClick={() => deleteSubject(s.id)} className="p-3 rounded-xl bg-bg-soft text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-20 text-center opacity-30 italic">No subjects registered in the curriculum.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 space-y-8">
              <div className="flex-between items-center">
                <h3 className="text-xl font-bold text-primary">{editingSubject ? 'Edit' : 'New'} Subject</h3>
                <button onClick={() => setShowModal(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Subject Name</label>
                  <input required type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mathematics" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Subject Code</label>
                    <input type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="MAT101" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Department</label>
                    <select className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Description</label>
                  <textarea className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the subject curriculum..."></textarea>
                </div>
                <button type="submit" className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                   {editingSubject ? 'Update Registry' : 'Add to Curriculum'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSubjects;
