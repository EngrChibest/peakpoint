import React, { useState, useEffect } from 'react';
import { ClipboardList, Check, X, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TeacherAttendance = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'excused' }

  const today = new Date().toISOString().split('T')[0];

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

  useEffect(() => {
    async function fetchStudents() {
      if (!selectedClassId) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'users'), where('classId', '==', selectedClassId), where('role', '==', 'student'));
        const snap = await getDocs(q);
        const studentList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
        
        // Default all to present
        const defaultAttendance = {};
        studentList.forEach(s => defaultAttendance[s.id] = 'present');
        
        // Check if attendance already exists for today
        const existingQ = query(
          collection(db, 'attendance'), 
          where('classId', '==', selectedClassId),
          where('date', '==', today)
        );
        const existingSnap = await getDocs(existingQ);
        if (!existingSnap.empty) {
          setAttendance(existingSnap.docs[0].data().records || defaultAttendance);
        } else {
          setAttendance(defaultAttendance);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchStudents();
  }, [selectedClassId, today]);

  const toggleStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const attendanceId = `${selectedClassId}_${today}`;
      await setDoc(doc(db, 'attendance', attendanceId), {
        classId: selectedClassId,
        date: today,
        records: attendance,
        teacherId: currentUser.uid,
        updatedAt: serverTimestamp()
      });
      showToast("Attendance submitted successfully!", "success");
    } catch (err) { 
      showToast("Error submitting attendance: " + err.message, "error"); 
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Register Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-secondary text-primary p-4 rounded-2xl shadow-lg">
              <ClipboardList size={32} />
            </div>
            <div className="space-y-1">
                <select 
                  value={selectedClassId} 
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="text-xl font-bold text-primary bg-transparent outline-none cursor-pointer border-b-2 border-transparent hover:border-primary/20"
                >
                  {[...new Set(assignments.map(a => ({ id: a.classId, name: a.className })))].map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>
          </div>
          <div className="flex items-center gap-6 px-8 py-3 bg-bg-soft rounded-2xl">
            <div className="text-center">
                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Present</p>
                <p className="text-lg font-bold text-green-500">{presentCount}</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Absent</p>
                <p className="text-lg font-bold text-red-500">{absentCount}</p>
            </div>
          </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/20">
            <h3 className="text-lg font-bold text-primary">Student Attendance Register</h3>
            <button 
              onClick={() => {
                const allPresent = {};
                students.forEach(s => allPresent[s.id] = 'present');
                setAttendance(allPresent);
              }}
              className="text-primary font-bold text-sm hover:underline"
            >
              Mark All Present
            </button>
        </div>
        
        <div className="divide-y divide-border/30">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
          ) : students.length > 0 ? students.map((std) => (
            <div key={std.id} className="px-8 py-6 flex items-center justify-between hover:bg-bg-soft/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex-center font-bold text-primary uppercase">
                  {std.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-primary">{std.fullName}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase">{std.portalId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleStatus(std.id, 'present')}
                    className={`w-12 h-12 rounded-2xl flex-center transition-all ${
                      attendance[std.id] === 'present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-bg-soft text-text-muted hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(std.id, 'absent')}
                    className={`w-12 h-12 rounded-2xl flex-center transition-all ${
                      attendance[std.id] === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-bg-soft text-text-muted hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <X size={20} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(std.id, 'excused')}
                    className={`w-12 h-12 rounded-2xl flex-center transition-all ${
                      attendance[std.id] === 'excused' ? 'bg-secondary text-primary shadow-lg shadow-secondary/20' : 'bg-bg-soft text-text-muted hover:bg-secondary/20 hover:text-primary'
                    }`}
                  >
                    <Clock size={20} />
                  </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-text-muted italic">No students found in this class.</div>
          )}
        </div>

        <div className="p-8 bg-bg-soft/20 text-center">
          <button 
            onClick={handleSubmit}
            disabled={isSaving || students.length === 0}
            className="btn btn-primary py-4 px-12 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <AlertCircle size={20} />}
            {isSaving ? 'Submitting...' : 'Submit Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
