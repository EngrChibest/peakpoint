import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Loader2, Save, Trash2, Calendar } from 'lucide-react';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TeacherTimetable = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '08:00 - 09:30',
    subject: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    async function fetchAssignments() {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'assignments'), where('teacherId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssignments(list);
        if (list.length > 0) setSelectedClassId(list[0].classId);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchAssignments();
  }, [currentUser]);

  const fetchTimetable = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'timetable'), where('classId', '==', selectedClassId));
      const snap = await getDocs(q);
      setTimetable(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedClassId]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const entryId = `${selectedClassId}_${formData.day}_${formData.time.replace(/\s+/g, '')}`;
      await setDoc(doc(db, 'timetable', entryId), {
        ...formData,
        classId: selectedClassId,
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || 'Teacher'
      });
      setShowModal(false);
      showToast("Entry saved successfully!", "success");
      fetchTimetable();
    } catch (err) { showToast(err.message, "error"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, 'timetable', id));
      showToast("Entry deleted", "success");
      fetchTimetable();
    } catch (err) { showToast(err.message, "error"); }
  };

  // Get unique classes from assignments
  const uniqueClasses = Array.from(new Map(assignments.map(a => [a.classId, { id: a.classId, name: a.className }])).values());

  return (
    <div className="space-y-8">
      <div className="flex-between items-center bg-white p-6 rounded-3xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="text-primary" size={24} />
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-lg font-bold text-primary bg-transparent outline-none cursor-pointer"
          >
            {uniqueClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={() => setShowModal(true)} disabled={!selectedClassId} className="btn btn-primary py-2.5 px-6 rounded-xl text-sm flex items-center gap-2">
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="bg-primary text-white p-4 rounded-2xl text-center">
              <p className="text-sm font-black uppercase tracking-widest">{day}</p>
            </div>
            <div className="space-y-4">
              {timetable.filter(t => t.day === day).map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm relative group">
                  <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-text-muted flex items-center gap-1"><Clock size={12} /> {item.time}</p>
                    <h4 className="font-bold text-primary text-sm">{item.subject}</h4>
                    <p className="text-[10px] text-text-muted">Room: {item.room}</p>
                  </div>
                </div>
              ))}
              {timetable.filter(t => t.day === day).length === 0 && (
                <div className="bg-bg-soft/30 border border-dashed border-border p-8 rounded-2xl text-center">
                  <p className="text-xs text-text-muted italic">No classes</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8">
            <div className="flex-between mb-8">
              <h3 className="text-xl font-bold text-primary">Add Timetable Entry</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddEntry} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Day</label>
                  <select className="w-full bg-bg-soft p-4 rounded-2xl" value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">Time Slot</label>
                  <input type="text" placeholder="08:00 - 09:30" className="w-full bg-bg-soft p-4 rounded-2xl text-sm" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Subject</label>
                <input required type="text" placeholder="e.g. Mathematics" className="w-full bg-bg-soft p-4 rounded-2xl" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">Room/Hall</label>
                <input required type="text" placeholder="e.g. Hall 1" className="w-full bg-bg-soft p-4 rounded-2xl" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-4 rounded-2xl font-bold flex-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
