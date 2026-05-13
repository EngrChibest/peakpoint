import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const StudentSchedule = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [studentData, setStudentData] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      try {
        const studentSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (studentSnap.exists()) {
          const sData = studentSnap.data();
          setStudentData(sData);
          
          if (sData.classId) {
            const q = query(collection(db, 'timetable'), where('classId', '==', sData.classId));
            const snap = await getDocs(q);
            setTimetable(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  const getDaySchedule = (day) => {
    return timetable.filter(t => t.day === day);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex-between items-center bg-white p-6 rounded-3xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="text-primary" size={24} />
          <div>
            <h3 className="font-bold text-primary">{studentData?.classId || 'Unassigned Class'}</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">2026/2027 Academic Session</p>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
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
              {getDaySchedule(day).map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <Clock size={12} className="text-secondary" />
                      {item.time}
                    </div>
                    <h4 className="font-bold text-primary text-sm leading-tight group-hover:text-secondary transition-colors">{item.subject}</h4>
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
    </div>
  );
};

export default StudentSchedule;
