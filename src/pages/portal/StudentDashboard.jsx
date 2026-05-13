import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNotifications } from '../../context/NotificationContext';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { notifications } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [averageScore, setAverageScore] = useState(0);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailySchedule, setDailySchedule] = useState(null);
  const [nextClass, setNextClass] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'student_data', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStudentData(data);

          if (data.classId) {
            // 1. Subject-wise Performance
            const subjectsQ = query(collection(db, 'subjects'), where('classId', '==', data.classId));
            const subjectsSnap = await getDocs(subjectsQ);
            const totalSubjectsCount = subjectsSnap.size || 1;

            const resultsQ = query(collection(db, 'results'), where('studentId', '==', currentUser.uid));
            const resultsSnap = await getDocs(resultsQ);
            
            // Normalize term filtering in-memory to match StudentGrades logic
            const resultsData = resultsSnap.docs
              .map(doc => doc.data())
              .filter(res => {
                const term = res.term?.toLowerCase() || '';
                const target = '1st Term'.toLowerCase(); // Default to current term
                return term === target || 
                       (target.includes('1st') && term.includes('first')) ||
                       (target.includes('first') && term.includes('1st'));
              });
            
            setSubjectPerformance(resultsData);

            const totalAccumulatedMarks = resultsData.reduce((acc, curr) => acc + (curr.total || 0), 0);
            const calculatedAverage = (totalAccumulatedMarks / totalSubjectsCount).toFixed(1);
            setAverageScore(calculatedAverage);

            // Sync averageScore to student_data for leaderboard
            if (data.averageScore !== calculatedAverage) {
              await updateDoc(docRef, { averageScore: calculatedAverage });
            }

            // 2. School Leaderboard (Top 5)
            const leaderboardQ = query(
              collection(db, 'student_data'), 
              orderBy('averageScore', 'desc'),
              limit(5)
            );
            const leaderboardSnap = await getDocs(leaderboardQ);
            setLeaderboard(leaderboardSnap.docs.map(doc => doc.data()));

            // 3. Timetable logic
            const qTimetable = query(collection(db, 'timetable'), where('classId', '==', data.classId));
            const timetableSnap = await getDocs(qTimetable);
            const timetableData = timetableSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (timetableData.length > 0) {
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const currentDay = days[new Date().getDay()];
              const convertTo24h = (timeStr) => {
                if (!timeStr) return "00:00";
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                return `${hours.toString().padStart(2, '0')}:${minutes}`;
              };
              const now = new Date();
              const currentTime24 = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
              const todayClasses = timetableData.filter(t => t.day === currentDay);
              setDailySchedule(todayClasses);
              const upcomingToday = todayClasses
                .filter(cls => convertTo24h(cls.time) > currentTime24)
                .sort((a, b) => convertTo24h(a.time).localeCompare(convertTo24h(b.time)))[0];

              if (upcomingToday) {
                setNextClass({ subject: upcomingToday.subject, startTime: upcomingToday.time, teacher: upcomingToday.teacherName, day: 'Today' });
              } else {
                let foundNext = null;
                for (let i = 1; i <= 7; i++) {
                  const nextDayName = days[(new Date().getDay() + i) % 7];
                  const nextDayClasses = timetableData.filter(t => t.day === nextDayName);
                  if (nextDayClasses.length > 0) {
                    const firstClass = nextDayClasses.sort((a, b) => convertTo24h(a.time).localeCompare(convertTo24h(b.time)))[0];
                    foundNext = { subject: firstClass.subject, startTime: firstClass.time, teacher: firstClass.teacherName, day: i === 1 ? 'Tomorrow' : nextDayName };
                    break;
                  }
                }
                setNextClass(foundNext);
              }
            }
          }
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [currentUser]);

  const stats = [
    { label: 'Attendance', value: studentData?.attendance || '100%', icon: Clock, color: 'bg-blue-500', trend: 'Monthly' },
    { label: 'Average Score (%)', value: `${averageScore}%`, icon: TrendingUp, color: 'bg-green-500', trend: 'Academic' },
    { label: 'Course Progress', value: studentData?.progress || 'In-Progress', icon: CheckCircle2, color: 'bg-secondary', trend: 'Term' },
    { label: 'Fee Status', value: studentData?.feeStatus || 'Check Fees', icon: AlertCircle, color: 'bg-primary', trend: 'Financial' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {loading ? (
        <div className="p-20 flex-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Hello, {studentData?.fullName?.split(' ')[0] || 'Student'}! 👋</h1>
              <p className="text-white/70 max-w-md">
                Welcome back to your academic portal. Stay updated with your class schedules and assessments below.
              </p>
              <Link to="/portal/student/timetable" className="mt-6 bg-secondary text-primary px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-all">
                View Full Timetable <ArrowRight size={18} />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-primary/10`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Schedule & Performance */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Schedule */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">Daily Schedule</h3>
                  <Link to="/portal/student/timetable" className="text-secondary font-black text-xs uppercase tracking-widest hover:underline">Full Timetable</Link>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-border/50 p-10 shadow-sm">
                  {nextClass ? (
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="bg-bg-soft w-full md:w-40 h-40 rounded-[2rem] flex-center flex-col text-center p-4 border border-primary/5">
                        <Clock size={32} className="text-primary mb-2" />
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{nextClass.day}</p>
                        <p className="text-lg font-black text-primary mt-1">{nextClass.startTime}</p>
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-block bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                          Next Available Session
                        </div>
                        <h4 className="text-3xl font-black text-primary leading-tight">{nextClass.subject}</h4>
                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex-center text-primary font-bold text-xs uppercase">{nextClass.teacher?.charAt(0)}</div>
                            <span className="text-sm font-bold text-text-muted">{nextClass.teacher}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center opacity-30 italic">
                       <Calendar size={48} className="mx-auto mb-4" />
                       <p className="text-xl font-bold">No classes scheduled.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject Performance - Interactive Chart */}
              <div className="space-y-4">
                <div className="px-2 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black text-primary uppercase tracking-tight">Academic Performance</h3>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Mastery levels across your curriculum</p>
                  </div>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1 rounded-full">First Term</span>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-border/50 p-10 shadow-sm">
                  {subjectPerformance.length > 0 ? (
                    <div className="h-64 flex items-end gap-4 md:gap-8 pt-8 px-4">
                      {subjectPerformance.map((res, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative h-full">
                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {res.total}%
                          </div>
                          
                          {/* Chart Bar */}
                          <div className="w-full flex-1 bg-bg-soft rounded-t-2xl relative overflow-hidden flex flex-col justify-end border border-border/10 group-hover:border-primary/30 transition-all">
                            <div 
                              className="w-full bg-primary transition-all duration-1000 ease-out shadow-lg shadow-primary/20 group-hover:bg-secondary" 
                              style={{ height: `${res.total}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                          </div>
                          
                          {/* Subject Label */}
                          <div className="w-full text-center">
                            <span className="text-[9px] font-black text-primary uppercase tracking-wider block truncate group-hover:text-secondary transition-colors">
                              {res.subject}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center opacity-30 italic">
                       <TrendingUp size={48} className="mx-auto mb-4" />
                       <p className="text-sm font-medium">No performance data found for First Term.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Leaderboard & Updates */}
            <div className="space-y-8">
              {/* Leaderboard */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight px-2">Top Scholars</h3>
                <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    {leaderboard.map((student, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className={`w-8 h-8 rounded-xl flex-center font-black text-xs ${i === 0 ? 'bg-secondary text-primary' : 'bg-white/10 text-white/60'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 border-b border-white/10 pb-2 flex-between items-center">
                          <div>
                            <p className="text-sm font-bold truncate max-w-[120px]">{student.fullName}</p>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{student.classId}</p>
                          </div>
                          <span className="text-secondary font-black">{student.averageScore}%</span>
                        </div>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <p className="text-xs text-white/40 italic text-center py-10">Leaderboard initializing...</p>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>
              </div>

              {/* Recent Updates */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight px-2">Institutional Updates</h3>
                <div className="bg-white rounded-[2rem] border border-border/50 p-6 shadow-sm">
                  <div className="divide-y divide-border/30">
                    {notifications.slice(0, 3).map((note, i) => (
                      <div key={i} className="py-4 first:pt-0">
                        <div className="flex gap-4">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${note.type === 'announcement' ? 'bg-primary' : 'bg-secondary'}`}></div>
                          <div>
                            <p className="text-sm font-bold text-primary mb-1 line-clamp-2">{note.message}</p>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                              {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-10 text-center opacity-30 italic">
                         <Bell size={32} className="mx-auto mb-2" />
                         <p className="text-xs font-bold uppercase tracking-widest">No updates</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
