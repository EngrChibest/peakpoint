import React from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const user = { name: 'Chibest Engr', id: 'PPIS/2026/001' };

  const stats = [
    { label: 'Attendance', value: '94%', icon: Clock, color: 'bg-blue-500', trend: '+2%' },
    { label: 'Current CGPA', value: '3.85', icon: TrendingUp, color: 'bg-green-500', trend: 'Stable' },
    { label: 'Course Progress', value: '78%', icon: CheckCircle2, color: 'bg-secondary', trend: '+12%' },
    { label: 'Fee Status', value: 'Cleared', icon: AlertCircle, color: 'bg-primary', trend: 'N/A' },
  ];

  return (
    <PortalLayout role="student" title="Student Dashboard" user={user}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}! 👋</h1>
            <p className="text-white/70 max-w-md">
              You have 3 assignments due this week. Your overall performance is excellent—keep it up!
            </p>
            <button className="mt-6 bg-secondary text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
              View Schedule <ArrowRight size={18} />
            </button>
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
                  <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex-between items-center">
              <h3 className="text-xl font-bold text-primary">Weekly Schedule</h3>
              <button className="text-secondary font-bold text-sm hover:underline">Full Calendar</button>
            </div>
            
            <div className="space-y-4">
              {[
                { time: '08:00 AM', subject: 'Advanced Mathematics', room: 'Block A, Hall 2', tutor: 'Prof. Okoro', color: 'border-blue-500' },
                { time: '10:30 AM', subject: 'Physics Practical', room: 'Lab 4', tutor: 'Dr. Sarah', color: 'border-secondary' },
                { time: '01:00 PM', subject: 'Computer Science', room: 'ICT Center', tutor: 'Engr. David', color: 'border-primary' },
              ].map((item, i) => (
                <div key={i} className={`bg-white p-6 rounded-3xl border-l-8 ${item.color} shadow-sm flex items-center justify-between`}>
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-bold text-primary">{item.time}</p>
                      <p className="text-[10px] text-text-muted font-bold">Today</p>
                    </div>
                    <div className="h-10 w-px bg-border"></div>
                    <div>
                      <h4 className="font-bold text-primary">{item.subject}</h4>
                      <p className="text-xs text-text-muted">{item.room} • {item.tutor}</p>
                    </div>
                  </div>
                  <button className="p-2.5 rounded-xl hover:bg-bg-soft text-text-muted hover:text-primary transition-all">
                    <AlertCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary / Notifications */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Announcements</h3>
            <div className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm divide-y divide-border/50">
              {[
                { title: 'School Fees Deadline', date: '2 days ago', type: 'urgent' },
                { title: 'Inter-house Sports Update', date: 'Yesterday', type: 'info' },
                { title: 'New Course Material Uploaded', date: 'Today', type: 'info' },
              ].map((note, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${note.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-primary mb-1">{note.title}</p>
                      <p className="text-xs text-text-muted">{note.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-6 py-3 text-sm font-bold text-primary hover:bg-bg-soft rounded-xl transition-all">
                View All Notifications
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-secondary/10 rounded-3xl p-6 border border-secondary/20">
              <h4 className="font-bold text-primary mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white p-3 rounded-2xl text-xs font-bold text-primary shadow-sm hover:scale-105 transition-all text-center">Library</button>
                <button className="bg-white p-3 rounded-2xl text-xs font-bold text-primary shadow-sm hover:scale-105 transition-all text-center">Results</button>
                <button className="bg-white p-3 rounded-2xl text-xs font-bold text-primary shadow-sm hover:scale-105 transition-all text-center">E-Learning</button>
                <button className="bg-white p-3 rounded-2xl text-xs font-bold text-primary shadow-sm hover:scale-105 transition-all text-center">Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentDashboard;
