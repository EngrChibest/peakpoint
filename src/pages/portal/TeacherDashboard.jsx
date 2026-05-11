import React from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardList,
  Plus,
  ArrowRight
} from 'lucide-react';

const TeacherDashboard = () => {
  const user = { name: 'Mrs. Adebayo', id: 'PPIS/TCH/2026/012' };

  const stats = [
    { label: 'Total Students', value: '142', icon: Users, color: 'bg-indigo-500' },
    { label: 'Classes Today', value: '4', icon: BookOpen, color: 'bg-secondary' },
    { label: 'Grading Pending', value: '28', icon: GraduationCap, color: 'bg-primary' },
    { label: 'Attendance %', value: '96.2%', icon: ClipboardList, color: 'bg-green-500' },
  ];

  return (
    <PortalLayout role="teacher" title="Teacher Dashboard" user={user}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm">
                <div className={`${stat.color} w-12 h-12 rounded-2xl text-white flex-center mb-4 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                  <Icon size={24} />
                </div>
                <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Classes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex-between items-center">
              <h3 className="text-xl font-bold text-primary">My Classes</h3>
              <button className="btn btn-primary py-2 px-4 text-xs flex items-center gap-2">
                <Plus size={16} /> New Class
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { class: 'Primary 4 Gold', students: 32, subject: 'English Language', performance: 'Exceeding' },
                { class: 'Primary 5 Silver', students: 28, subject: 'Literacy', performance: 'On Track' },
                { class: 'JSS 1 Maroon', students: 35, subject: 'Social Studies', performance: 'Review Needed' },
                { class: 'Nursery 2', students: 25, subject: 'Creative Arts', performance: 'Exceeding' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-bg-soft p-3 rounded-2xl group-hover:bg-primary/5 transition-colors">
                      <Users className="text-primary" size={24} />
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      item.performance === 'Exceeding' ? 'bg-green-100 text-green-600' : 
                      item.performance === 'On Track' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.performance}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-1">{item.class}</h4>
                  <p className="text-xs text-text-muted font-bold mb-6 uppercase tracking-wider">{item.subject}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(v => (
                        <div key={v} className="w-8 h-8 rounded-full bg-bg-soft border-2 border-white flex-center text-[10px] font-bold text-primary">
                          {v}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-secondary text-primary border-2 border-white flex-center text-[10px] font-bold">
                        +{item.students - 4}
                      </div>
                    </div>
                    <button className="text-primary font-bold text-xs hover:gap-2 flex items-center gap-1 transition-all">
                      Manage <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tasks */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Academic Tasks</h3>
            <div className="bg-white rounded-[2rem] border border-border/50 p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Immediate Actions</p>
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-between group">
                      Mark JSS 1 Attendance
                      <Plus className="group-hover:rotate-90 transition-transform" />
                    </button>
                    <button className="w-full text-left p-4 bg-white border border-border rounded-2xl font-bold text-sm text-primary hover:bg-bg-soft transition-all">
                      Review Mid-term Results
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Upcoming Deadlines</p>
                  <div className="space-y-4">
                    {[
                      { task: 'Lesson Plan Submission', date: 'Tomorrow' },
                      { task: 'Report Card Comments', date: 'Fri, 15 May' },
                      { task: 'Staff Meeting', date: 'Wed, 13 May' },
                    ].map((t, i) => (
                      <div key={i} className="flex-between items-center">
                        <span className="text-sm font-medium text-primary">{t.task}</span>
                        <span className="text-[10px] font-bold text-secondary uppercase">{t.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default TeacherDashboard;
