import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardList,
  Plus,
  ArrowRight,
  Loader2,
  Cake,
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
  Target,
  Info,
  Filter
} from 'lucide-react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart, 
  Pie
} from 'recharts';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('all');

  // Stats stored as original lists for filtering
  const [rawAssignments, setRawAssignments] = useState([]);
  const [rawStudents, setRawStudents] = useState([]);
  const [rawResults, setRawResults] = useState([]);
  const [rawAttendance, setRawAttendance] = useState([]);

  useEffect(() => {
    // Small delay to ensure layout is stable
    const timer = setTimeout(() => setIsChartReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchTeacherData() {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        const assignmentsRef = collection(db, 'assignments');
        const q = query(assignmentsRef, where('teacherId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const assignmentData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRawAssignments(assignmentData);

        const classIds = [...new Set(assignmentData.map(a => a.classId))].filter(Boolean);
        if (classIds.length > 0) {
          const studentsQ = query(
            collection(db, 'users'), 
            where('role', '==', 'student'),
            where('classId', 'in', classIds)
          );
          const studentsSnap = await getDocs(studentsQ);
          setRawStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const attendanceQ = query(collection(db, 'attendance'), where('classId', 'in', classIds));
          const attendanceSnap = await getDocs(attendanceQ);
          setRawAttendance(attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const resultsQ = query(collection(db, 'results'), where('classId', 'in', classIds));
          const resultsSnap = await getDocs(resultsQ);
          setRawResults(resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeacherData();

    // One-time Institutional Cleanup: Remove results without a term
    const cleanupLegacyData = async () => {
      try {
        const resultsRef = collection(db, 'results');
        const snap = await getDocs(resultsRef);
        let count = 0;
        for (const d of snap.docs) {
          if (!d.data().term) {
            await deleteDoc(doc(db, 'results', d.id));
            count++;
          }
        }
        if (count > 0) console.log(`Institutional Cleanup: Removed ${count} orphan records.`);
      } catch (err) { console.error("Cleanup error:", err); }
    };
    cleanupLegacyData();

  }, [currentUser]);

  // Handle Filtering
  useEffect(() => {
    if (loading) return;

    const filteredStudents = selectedClassId === 'all' 
      ? rawStudents 
      : rawStudents.filter(s => s.classId === selectedClassId);
    
    setStudents(filteredStudents);

    const filteredAssignments = selectedClassId === 'all' 
      ? rawAssignments 
      : rawAssignments.filter(a => a.classId === selectedClassId);
    
    setAssignments(filteredAssignments);

    // Gender Data
    const male = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'male').length;
    const female = filteredStudents.filter(s => (s.gender || '').toLowerCase() === 'female').length;
    setGenderData([
      { name: 'Male', value: male, color: '#3b82f6' },
      { name: 'Female', value: female, color: '#ec4899' }
    ]);

    const currentMonth = new Date().getMonth() + 1;
    setBirthdays(filteredStudents.filter(s => s.dob && (new Date(s.dob).getMonth() + 1) === currentMonth));

    // Attendance
    const filteredAttendance = selectedClassId === 'all' 
      ? rawAttendance 
      : rawAttendance.filter(a => a.classId === selectedClassId);

    if (filteredAttendance.length > 0) {
      let totalCount = 0, presentCount = 0;
      filteredAttendance.forEach(doc => {
        Object.entries(doc.records || {}).forEach(([studentId, status]) => {
          // Only count if student is in the current filtered list
          if (filteredStudents.some(s => s.id === studentId)) {
            totalCount++;
            if (status === 'present') presentCount++;
          }
        });
      });
      setAttendanceRate(totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0);
    } else {
      setAttendanceRate(0);
    }

    // Performance Calculations
    const currentTerm = '1st Term'; // Institutional default for current view
    const filteredResults = selectedClassId === 'all'
      ? rawResults.filter(r => r.term === currentTerm)
      : rawResults.filter(r => r.classId === selectedClassId && r.term === currentTerm);

    const dist = { 
      'A1': { count: 0, range: '75-100', totalScore: 0 }, 
      'B2': { count: 0, range: '70-74', totalScore: 0 }, 
      'B3': { count: 0, range: '65-69', totalScore: 0 }, 
      'C4': { count: 0, range: '60-64', totalScore: 0 }, 
      'C5': { count: 0, range: '55-59', totalScore: 0 }, 
      'C6': { count: 0, range: '50-54', totalScore: 0 }, 
      'D7': { count: 0, range: '45-49', totalScore: 0 }, 
      'E8': { count: 0, range: '40-44', totalScore: 0 }, 
      'F9': { count: 0, range: '0-39', totalScore: 0 } 
    };
    
    let totalScoreSum = 0;
    let totalResultsCount = 0;

    const calculateGradeOnFly = (total) => {
      if (total >= 75) return 'A1';
      if (total >= 70) return 'B2';
      if (total >= 65) return 'B3';
      if (total >= 60) return 'C4';
      if (total >= 55) return 'C5';
      if (total >= 50) return 'C6';
      if (total >= 45) return 'D7';
      if (total >= 40) return 'E8';
      return 'F9';
    };

    filteredResults.forEach(data => {
      // Ensure result belongs to an assignment held by this teacher
      const isAssignedToTeacher = rawAssignments.some(a => 
        a.classId === data.classId && 
        a.subject?.trim().toLowerCase() === data.subject?.trim().toLowerCase()
      );

      if (isAssignedToTeacher) {
        if (data.total !== undefined) {
          const g = calculateGradeOnFly(data.total);
          totalScoreSum += data.total;
          totalResultsCount++;
          
          if (dist[g]) {
            dist[g].count++;
            dist[g].totalScore += data.total;
          }
        }
      }
    });

    setGradeDistribution(Object.entries(dist).map(([name, info]) => ({ 
      name, 
      avgScore: info.count > 0 ? Math.round(info.totalScore / info.count) : 0,
      count: info.count, 
      range: info.range 
    })));

    setAverageScore(totalResultsCount > 0 ? Math.round(totalScoreSum / totalResultsCount) : 0);

  }, [selectedClassId, rawStudents, rawAssignments, rawResults, rawAttendance, loading]);

  const [averageScore, setAverageScore] = useState(0);

  const stats = [
    { 
      label: 'Assigned Subjects', 
      value: assignments.length, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      id: 'subjects',
      details: [...new Set(assignments.map(a => a.subject))]
    },
    { 
      label: 'Classes Covered', 
      value: [...new Set(assignments.map(a => a.classId))].length, 
      icon: Users, 
      color: 'bg-purple-500',
      id: 'classes',
      details: [...new Set(assignments.map(a => a.className))]
    },
    { label: 'Total Students', value: students.length, icon: GraduationCap, color: 'bg-primary', id: 'students' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: ClipboardList, color: 'bg-green-500', id: 'attendance' },
  ];

  if (loading) return (
    <div className="p-20 flex-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <Filter size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Analytical Overview</h2>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Real-time performance metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-soft p-1.5 rounded-2xl border border-border/30">
          <label htmlFor="dashboard-class-filter" className="text-[10px] font-black text-primary uppercase pl-3">Filter by Class</label>
          <select 
            id="dashboard-class-filter"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white border border-border/50 px-4 py-2 rounded-xl text-sm font-bold text-primary outline-none focus:border-secondary transition-all"
          >
            <option value="all">All Classes</option>
            {[...new Set(rawAssignments.map(a => a.classId))].map(id => {
              const cls = rawAssignments.find(a => a.classId === id);
              return <option key={id} value={id}>{cls.className}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="relative"
              onMouseEnter={() => setHoveredStat(stat.id)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all cursor-help"
              >
                <div className={`${stat.color} w-12 h-12 rounded-2xl text-white flex-center mb-4 shadow-lg`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                  </div>
                  {stat.details && <Info size={16} className="text-text-muted opacity-30" />}
                </div>
              </motion.div>

              <AnimatePresence>
                {hoveredStat === stat.id && stat.details && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-primary text-white p-4 rounded-2xl shadow-2xl"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">List of {stat.label}</p>
                    <ul className="space-y-1">
                      {stat.details.map((item, idx) => (
                        <li key={idx} className="text-xs font-bold flex items-center gap-2">
                          <div className="w-1 h-1 bg-secondary rounded-full"></div> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Grade Distribution Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary"><TrendingUp size={20} /></div>
              <div>
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Academic Performance</h4>
                <p className="text-[10px] font-bold text-text-muted uppercase">Score Range: 0 - 100</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Class Average</p>
               <h3 className="text-2xl font-black text-primary">{averageScore}%</h3>
            </div>
          </div>
          <div className="h-[350px] w-full min-w-0 overflow-hidden">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <BarChart data={gradeDistribution} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-border/50">
                          <p className="text-[10px] font-black text-text-muted uppercase mb-1">Grade {data.name}</p>
                          <p className="text-lg font-black text-primary mb-1">{data.avgScore}% <span className="text-xs font-bold text-text-muted">Avg Mark</span></p>
                          <p className="text-[10px] font-bold text-primary/40 uppercase mb-2">Requirement: {data.range}</p>
                          <div className="h-px bg-border/50 mb-2"></div>
                          <p className="text-[10px] font-bold text-primary/60 uppercase">{data.count} Students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgScore" radius={[10, 10, 0, 0]} label={{ position: 'top', fill: '#64748b', fontSize: 10, fontWeight: 'bold', formatter: (val) => val > 0 ? `${val}%` : '' }}>
                  {gradeDistribution.map((entry, index) => {
                    const colors = {
                      'A1': '#22c55e',
                      'B2': '#16a34a',
                      'B3': '#3b82f6',
                      'C4': '#2563eb',
                      'C5': '#f59e0b',
                      'C6': '#d97706',
                      'D7': '#f97316',
                      'E8': '#ea580c',
                      'F9': '#ef4444'
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.name] || '#cbd5e1'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex-center bg-bg-soft/20 rounded-2xl animate-pulse">
                 <Loader2 className="text-primary/20 animate-spin" />
              </div>
            )}
          </div>

          {/* Color Legend */}
          <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-3 sm:grid-cols-5 gap-4">
             {[
               { g: 'A1', l: 'Excellent', c: 'bg-[#22c55e]' },
               { g: 'B2', l: 'Very Good', c: 'bg-[#16a34a]' },
               { g: 'B3', l: 'Good', c: 'bg-[#3b82f6]' },
               { g: 'C4', l: 'Credit', c: 'bg-[#2563eb]' },
               { g: 'C5', l: 'Credit', c: 'bg-[#f59e0b]' },
               { g: 'C6', l: 'Credit', c: 'bg-[#d97706]' },
               { g: 'D7', l: 'Pass', c: 'bg-[#f97316]' },
               { g: 'E8', l: 'Pass', c: 'bg-[#ea580c]' },
               { g: 'F9', l: 'Fail', c: 'bg-[#ef4444]' },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${item.c} shadow-sm`}></div>
                 <div>
                   <p className="text-[10px] font-black text-primary leading-none mb-0.5">{item.g}</p>
                   <p className="text-[8px] font-bold text-text-muted uppercase leading-none">{item.l}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-2 rounded-xl text-primary"><PieChartIcon size={20} /></div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Gender Distribution</h4>
            </div>
          </div>
          <div className="h-[350px] w-full relative min-w-0 overflow-hidden">
            {isChartReady ? (
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex-center bg-bg-soft/20 rounded-2xl animate-pulse">
                 <Loader2 className="text-primary/20 animate-spin" />
              </div>
            )}
            {/* Center Text for Pie */}
            <div className="absolute inset-0 flex-center flex-col pointer-events-none">
              <p className="text-2xl font-black text-primary">{students.length}</p>
              <p className="text-[10px] font-bold text-text-muted uppercase">Students</p>
            </div>
          </div>

          {/* Gender Legend */}
          <div className="mt-4 pt-6 border-t border-border/50 flex justify-center gap-8">
            {genderData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <p className="text-xs font-bold text-primary">{item.name}: <span className="text-text-muted">{item.value}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Birthday Alerts */}
           <div className={`${birthdays.length > 0 ? 'bg-pink-50 border-pink-100' : 'bg-bg-soft/30 border-border/50'} border p-8 rounded-[2.5rem] shadow-sm`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-2xl shadow-sm ${birthdays.length > 0 ? 'bg-white text-pink-500' : 'bg-white text-text-muted'}`}>
                <Cake size={24} />
              </div>
              <div>
                <h4 className={`text-lg font-bold ${birthdays.length > 0 ? 'text-pink-700' : 'text-text-muted'}`}>Class Birthdays</h4>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
              </div>
            </div>
            
            {birthdays.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {birthdays.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-pink-200/50 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-pink-100 flex-center text-xs font-black text-pink-600 uppercase overflow-hidden">
                      {s.avatar ? (
                        <img src={s.avatar} alt={s.fullName} className="w-full h-full object-cover" />
                      ) : (
                        (s.fullName || 'S').charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pink-800">{s.fullName}</p>
                      <p className="text-[10px] font-black text-pink-600/60 uppercase">
                        {new Date(s.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                 <p className="text-xs text-text-muted italic">No birthdays this month in your classes.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-bold text-primary">Academic Tasks</h3>
           <div className="bg-white rounded-[2.5rem] border border-border/50 p-8 shadow-sm space-y-6">
              <button onClick={() => navigate('/portal/teacher/attendance')} className="w-full text-left p-5 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-between group transition-all hover:scale-[1.02]">
                Mark Attendance <Plus className="group-hover:rotate-90 transition-transform" />
              </button>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => navigate('/portal/teacher/assessments')} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 bg-white rounded-lg flex-center shadow-sm"><ClipboardList size={14} /></div>
                  Manage CBT Assessments
                </button>
                <button onClick={() => navigate('/portal/teacher/grading')} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 bg-white rounded-lg flex-center shadow-sm"><GraduationCap size={14} /></div>
                  Result Entry
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
