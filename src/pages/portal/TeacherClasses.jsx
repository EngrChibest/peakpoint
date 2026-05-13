import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MoreVertical, 
  Search, 
  Filter, 
  Mail, 
  Calendar, 
  Loader2, 
  ChevronLeft,
  GraduationCap,
  Award,
  Phone,
  UserCircle,
  Cake
} from 'lucide-react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch assignments for this teacher
    const q = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const assignmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(assignmentData);
      
      const classIds = [...new Set(assignmentData.map(a => a.classId))].filter(Boolean);
      if (classIds.length > 0) {
        setStudentsLoading(true);
        try {
          // Fetch All Students for these classes
          const studentsQ = query(
            collection(db, 'users'), 
            where('role', '==', 'student'),
            where('classId', 'in', classIds)
          );
          const studentsSnap = await getDocs(studentsQ);
          const studentList = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Fetch Metrics
          const performanceQ = query(collection(db, 'student_data'), where('classId', 'in', classIds));
          const perfSnap = await getDocs(performanceQ);
          const perfMap = {};
          perfSnap.docs.forEach(d => perfMap[d.id] = d.data());

          const attendanceQ = query(collection(db, 'attendance'), where('classId', 'in', classIds));
          const attSnap = await getDocs(attendanceQ);
          const attRecords = attSnap.docs.map(d => d.data().records || {});

          const finalStudents = studentList.map(s => {
            const p = perfMap[s.id] || {};
            let tot = 0, pres = 0;
            attRecords.forEach(r => {
              if (r[s.id]) { tot++; if (r[s.id] === 'present') pres++; }
            });
            return {
              ...s,
              averageScore: parseFloat(p.averageScore || 0),
              attendancePercent: tot > 0 ? Math.round((pres / tot) * 100) : 0,
              dob: p.dob || s.dob // Use birth date from either source
            };
          });

          setStudents(finalStudents);
        } catch (err) {
          console.error("Roster error:", err);
        } finally {
          setStudentsLoading(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user.uid]);

  const [filterClass, setFilterClass] = useState('all');

  const studentsToShow = students.filter(s => {
    const matchesSearch = (s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || s.id?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Controls */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Student Management</h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Global Roster & Institutional Directory</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full bg-bg-soft border border-border/50 pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-bg-soft border border-border/50 px-6 py-3 rounded-2xl text-sm font-bold text-primary outline-none focus:border-primary transition-all"
          >
            <option value="all">All Classes</option>
            {[...new Set(classes.map(c => c.classId))].map(id => {
              const cls = classes.find(c => c.classId === id);
              return <option key={id} value={id}>{cls.className}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Students Roster Grid */}
      {studentsLoading ? (
        <div className="p-20 flex-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentsToShow.map((student) => {
            const isBirthday = student.dob && (new Date(student.dob).getMonth() === new Date().getMonth() && new Date(student.dob).getDate() === new Date().getDate());
            
            return (
              <div key={student.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group text-center relative overflow-hidden">
                {isBirthday && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <Cake className="text-pink-500" size={20} />
                  </div>
                )}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-bg-soft group-hover:bg-primary transition-colors"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="w-24 h-24 bg-bg-soft rounded-[2.5rem] mx-auto flex-center text-primary font-black text-3xl uppercase border-4 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                    ) : (
                      student.fullName?.charAt(0)
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-primary text-lg leading-tight mb-1">{student.fullName}</h4>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{student.portalId || 'STUDENT'}</p>
                      <span className="bg-primary/5 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        {student.classId}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button className="p-3 rounded-2xl bg-bg-soft text-text-muted hover:bg-primary hover:text-white transition-all"><Mail size={16} /></button>
                    <button className="p-3 rounded-2xl bg-bg-soft text-text-muted hover:bg-secondary hover:text-primary transition-all"><Phone size={16} /></button>
                    <button className="p-3 rounded-2xl bg-bg-soft text-text-muted hover:bg-primary hover:text-white transition-all"><UserCircle size={16} /></button>
                  </div>

                  <div className="pt-6 border-t border-border/30 grid grid-cols-2 gap-4">
                    <div className="text-left">
                       <p className="text-[8px] font-black text-text-muted uppercase mb-0.5">Attendance</p>
                       <p className="text-xs font-bold text-primary">{student.attendancePercent}%</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-text-muted uppercase mb-0.5">Performance</p>
                       <p className="text-xs font-bold text-secondary">{student.averageScore}%</p>
                    </div>
                  </div>
                  
                  {student.dob && (
                    <div className="pt-4 flex-center gap-2">
                      <Calendar size={12} className="text-text-muted" />
                      <p className="text-[10px] font-bold text-text-muted">
                        {new Date(student.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {studentsToShow.length === 0 && (
            <div className="col-span-full py-24 text-center bg-bg-soft/30 rounded-[3rem] border border-dashed border-border">
               <Users size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
               <p className="text-lg font-bold text-text-muted italic">No students found in the directory.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
