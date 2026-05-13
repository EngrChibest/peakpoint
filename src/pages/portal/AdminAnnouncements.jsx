import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  X, 
  Loader2, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    link: '',
    active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'announcements', editingId), data);
      } else {
        await addDoc(collection(db, 'announcements'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', content: '', type: 'info', link: '', active: true });
      fetchData();
    } catch (err) {
      showToast("Error saving announcement: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'announcements', id), { active: !currentStatus });
      fetchData();
    } catch (err) { showToast("Error updating status: " + err.message, "error"); }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      try {
        await deleteDoc(doc(db, 'announcements', id));
        showToast("Announcement deleted", "success");
        fetchData();
      } catch (err) { showToast(err.message, "error"); }
    }
  };

  const openEdit = (ann) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title,
      content: ann.content,
      type: ann.type || 'info',
      link: ann.link || '',
      active: ann.active
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-primary">Global Announcements</h2>
          <p className="text-sm text-text-muted">Manage real-time alerts for the entire school portal.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="btn btn-primary py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <th className="px-8 py-4">Announcement</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-bg-soft/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-bg-soft ${
                          ann.type === 'urgent' ? 'text-red-500' : 
                          ann.type === 'warning' ? 'text-secondary' : 'text-primary'
                        }`}>
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{ann.title}</p>
                          <p className="text-xs text-text-muted max-w-md truncate">{ann.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                        ann.type === 'urgent' ? 'bg-red-100 text-red-600' : 
                        ann.type === 'warning' ? 'bg-secondary/20 text-primary' : 'bg-primary/10 text-primary'
                      }`}>
                        {ann.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleStatus(ann.id, ann.active)} className="flex items-center gap-2">
                        {ann.active ? (
                          <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                            <ToggleRight size={20} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-text-muted text-xs font-bold">
                            <ToggleLeft size={20} /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(ann)} className="p-2 hover:bg-bg-soft rounded-lg text-primary"><Edit2 size={16} /></button>
                        <button onClick={() => deleteAnnouncement(ann.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-border/50">
              <h3 className="text-xl font-bold text-primary">{editingId ? 'Edit' : 'Create'} Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Title</label>
                <input required type="text" className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Content</label>
                <textarea required className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none h-32" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Type</label>
                  <select className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Status</label>
                  <select className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl" value={formData.active} onChange={(e) => setFormData({...formData, active: e.target.value === 'true'})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">External Link (Optional)</label>
                <input type="url" placeholder="https://..." className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-4 rounded-2xl font-bold flex-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {isSubmitting ? 'Saving...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
