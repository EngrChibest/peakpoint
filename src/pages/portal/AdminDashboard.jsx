import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Calendar,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    enrollment: '0',
    revenue: '₦42.8M',
    unreadInquiries: 0,
    pendingVisits: 0,
    academicOverview: {
      avgScore: 0,
      masteryLevel: 0,
      gradeDist: [],
      classPerf: []
    }
  });
  const [loading, setLoading] = useState(true);

  const currentTerm = '1st Term';

  useEffect(() => {
    // 1. Enrollment Count
    const fetchEnrollment = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'student'));
      const snap = await getDocs(q);
      setStats(prev => ({ ...prev, enrollment: snap.size.toLocaleString() }));
    };

    // 2. Real-time listener for inquiries/visits
    const q = query(collection(db, 'inquiries'), where('status', '!=', 'read'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unread = snapshot.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        unreadInquiries: unread.filter(i => i.type !== 'visit_request').length,
        pendingVisits: unread.filter(i => i.type === 'visit_request').length
      }));
    });

    // 3. Academic Overview Logic
    const fetchAcademicData = async () => {
      try {
        const resultsQ = query(collection(db, 'results'), where('term', '==', currentTerm));
        const snap = await getDocs(resultsQ);
        const results = snap.docs.map(d => d.data());

        if (results.length === 0) return;

        // Calculate Grade Distribution
        const dist = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0 };
        let totalScore = 0;
        let masteryCount = 0;

        results.forEach(r => {
          const score = parseFloat(r.totalScore || 0);
          totalScore += score;
          if (score >= 50) masteryCount++;

          if (score >= 75) dist['A']++;
          else if (score >= 65) dist['B']++;
          else if (score >= 50) dist['C']++;
          else if (score >= 45) dist['D']++;
          else if (score >= 40) dist['E']++;
          else dist['F']++;
        });

        const gradeData = Object.keys(dist).map(name => ({ name, value: dist[name] }));

        // Calculate Class Performance
        const classMap = {};
        results.forEach(r => {
          if (!classMap[r.className]) classMap[r.className] = { total: 0, count: 0 };
          classMap[r.className].total += parseFloat(r.totalScore || 0);
          classMap[r.className].count++;
        });

        const classData = Object.keys(classMap).map(name => ({
          name: name.split(' ')[0] + (name.split(' ')[1] ? ' ' + name.split(' ')[1] : ''),
          score: Math.round(classMap[name].total / classMap[name].count)
        })).sort((a, b) => b.score - a.score).slice(0, 6);

        setStats(prev => ({
          ...prev,
          academicOverview: {
            avgScore: Math.round(totalScore / results.length),
            masteryLevel: Math.round((masteryCount / results.length) * 100),
            gradeDist: gradeData,
            classPerf: classData
          }
        }));
      } catch (err) { console.error("Admin Analytics Error:", err); }
      finally { setLoading(false); }
    };

    fetchEnrollment();
    fetchAcademicData();
    return () => unsubscribe();
  }, []);

  const cards = [
    { label: 'Total Enrollment', value: stats.enrollment, icon: Users, color: 'bg-primary', trend: '+4.5%', isUp: true },
    { label: 'Term Revenue', value: stats.revenue, icon: CreditCard, color: 'bg-green-500', trend: '+12%', isUp: true },
    { label: 'Unread Inquiries', value: stats.unreadInquiries, icon: MessageSquare, color: 'bg-secondary', trend: 'Response Needed', isUp: false, path: '/portal/admin/inquiries' },
    { label: 'Pending Visits', value: stats.pendingVisits, icon: Calendar, color: 'bg-blue-500', trend: 'Schedule Tours', isUp: true, path: '/portal/admin/inquiries' },
  ];

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              onClick={() => card.path && navigate(card.path)}
              className={`bg-white p-6 rounded-[2.5rem] border border-border/50 shadow-sm relative overflow-hidden group transition-all ${card.path ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : ''}`}
            >
              <div className="relative z-10">
                <div className={`${card.color} w-14 h-14 rounded-2xl text-white flex-center mb-6 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-primary">{card.value}</h3>
                  <span className={`flex items-center gap-0.5 text-[10px] font-black mb-1.5 px-2 py-0.5 rounded-full ${card.isUp ? 'bg-green-50 text-green-600' : 'bg-secondary/10 text-primary'}`}>
                    {card.trend}
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-bg-soft rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              {card.path && (
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 flex-between items-center border-b border-border/50 bg-bg-soft/20">
            <div>
               <h3 className="text-xl font-bold text-primary">Academic Overview</h3>
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Institutional Performance ({currentTerm})</p>
            </div>
            <button className="text-primary font-bold text-sm bg-white border border-border/50 px-6 py-2.5 rounded-2xl hover:bg-bg-soft transition-all">Download Report</button>
          </div>
          
          <div className="p-8 grid md:grid-cols-2 gap-8 flex-1">
             {/* Key Metrics */}
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-bg-soft rounded-3xl border border-border/30">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">School Avg</p>
                      <h4 className="text-3xl font-black text-primary">{stats.academicOverview.avgScore}%</h4>
                      <div className="w-full h-1.5 bg-border rounded-full mt-3 overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${stats.academicOverview.avgScore}%` }}></div>
                      </div>
                   </div>
                   <div className="p-6 bg-bg-soft rounded-3xl border border-border/30">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Mastery</p>
                      <h4 className="text-3xl font-black text-secondary">{stats.academicOverview.masteryLevel}%</h4>
                      <div className="w-full h-1.5 bg-border rounded-full mt-3 overflow-hidden">
                         <div className="h-full bg-secondary" style={{ width: `${stats.academicOverview.masteryLevel}%` }}></div>
                      </div>
                   </div>
                </div>

                <div className="h-[250px] w-full">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Grade Distribution</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.academicOverview.gradeDist}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.academicOverview.gradeDist.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#003366', '#FF9900', '#10B981', '#F59E0B', '#EF4444', '#334155'][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Class Performance Chart */}
             <div className="flex flex-col h-full">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Top Performing Classes</p>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.academicOverview.classPerf} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={80}
                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="score" fill="#003366" radius={[0, 8, 8, 0]} barSize={20}>
                        {stats.academicOverview.classPerf.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score >= 70 ? '#10B981' : '#003366'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary">Administrative Tasks</h3>
          <div className="bg-white rounded-[2.5rem] border border-border/50 p-8 shadow-sm space-y-4">
             <button onClick={() => navigate('/portal/admin/inquiries')} className="w-full py-5 px-6 bg-bg-soft border border-border/50 rounded-2xl text-left text-sm font-black text-primary hover:bg-secondary hover:border-secondary transition-all flex-between items-center group">
               Review New Inquiries
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button onClick={() => navigate('/portal/admin/subjects')} className="w-full py-5 px-6 bg-bg-soft border border-border/50 rounded-2xl text-left text-sm font-black text-primary hover:bg-secondary hover:border-secondary transition-all flex-between items-center group">
               Update Subject Registry
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button onClick={() => navigate('/portal/admin/alerts')} className="w-full py-5 px-6 bg-primary text-white rounded-2xl text-left text-sm font-black hover:shadow-xl transition-all flex-between items-center group">
               Global Announcement
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
          
          <div className="bg-secondary/10 border border-secondary/20 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-4 mb-4">
                <div className="bg-white p-3 rounded-2xl text-primary shadow-sm">
                   <ShieldCheck size={24} />
                </div>
                <h4 className="text-lg font-bold text-primary">System Secure</h4>
             </div>
             <p className="text-xs text-primary/70 font-medium leading-relaxed">All institutional data is encrypted and backed up in real-time. System status: 100% Operational.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
