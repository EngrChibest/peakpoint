import React, { useState, useEffect } from 'react';
import { Plus, Clock, MapPin, User, Save, Loader2, Trash2, X, Search } from 'lucide-react';
import { collection, getDocs, doc, setDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';

const AdminTimetable = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '',
    subject: '',
    teacherId: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const classSnap = await getDocs(collection(db, 'classes'));
      const classData = classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(classData);
      if (classData.length > 0 && !selectedClassId) {
        setSelectedClassId(classData[0].id);
      }

      const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
      const teacherSnap = await getDocs(q);
      setTeachers(teacherSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async (classId) => {
    if (!classId) return;
    try {
      const q = query(collection(db, 'timetable'), where('classId', '==', classId));
      const snap = await getDocs(q);
      setTimetable(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchTimetable(selectedClassId);
    }
  }, [selectedClassId]);

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const teacher = teachers.find(t => t.id === formData.teacherId);
      const entryId = `${selectedClassId}-${formData.day}-${formData.time.replace(/\s+/g, '-')}`.toLowerCase();
      
      await setDoc(doc(db, 'timetable', entryId), {
        ...formData,
        classId: selectedClassId,
        teacherName: teacher?.fullName || 'N/A',
        createdAt: new Date().toISOString()
      });

      setShowModal(false);
      setFormData({ day: 'Monday', time: '', subject: '', teacherId: '', room: '' });
      fetchTimetable(selectedClassId);
    } catch (err) {
      showToast("Error saving timetable entry: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm("Delete this timetable entry?")) {
      try {
        await deleteDoc(doc(db, 'timetable', id));
        fetchTimetable(selectedClassId);
      } catch (err) {
        showToast("Error deleting entry: " + err.message, "error");
      }
    }
  };

  const getDaySchedule = (day) => {
    return timetable.filter(t => t.day === day).sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-primary uppercase tracking-widest">Select Class</label>
          <select 
            className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl font-bold text-primary outline-none focus:border-primary"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-2"
        >
          <Plus size={20} /> Add Entry
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="lg:col-span-5 p-20 flex-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="bg-primary text-white p-4 rounded-2xl text-center shadow-lg shadow-primary/20">
              <p className="text-sm font-black uppercase tracking-widest">{day}</p>
            </div>
            
            <div className="space-y-4">
              {getDaySchedule(day).map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                  <button 
                    onClick={() => handleDeleteEntry(item.id)}
                    className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <Clock size={12} className="text-secondary" />
                      {item.time}
                    </div>
                    <h4 className="font-bold text-primary text-sm leading-tight">{item.subject}</h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted">
                        <MapPin size={12} /> {item.room}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-text-muted">
                        <User size={12} /> {item.teacherName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {getDaySchedule(day).length === 0 && (
                <div className="bg-bg-soft/30 border border-dashed border-border p-8 rounded-2xl text-center">
                  <p className="text-xs text-text-muted italic">No classes</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-primary">Add Timetable Entry</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEntry} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase">Day</label>
                  <select 
                    className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none"
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase">Time (e.g. 08:00 AM)</label>
                  <input 
                    required type="text" 
                    placeholder="08:00 AM" 
                    className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase">Subject</label>
                <input 
                  required type="text" 
                  placeholder="e.g. Mathematics" 
                  className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase">Teacher</label>
                <select 
                  required
                  className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase">Room / Venue</label>
                <input 
                  required type="text" 
                  placeholder="e.g. Hall 2" 
                  className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-4 rounded-2xl font-bold flex-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSubmitting ? 'Saving...' : 'Add to Timetable'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetable;
