import React from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
  const user = { name: 'Admin Principal', id: 'PPIS/ADM/001' };

  const cards = [
    { label: 'Total Enrollment', value: '1,248', icon: Users, color: 'bg-primary', trend: '+4.5%', isUp: true },
    { label: 'Term Revenue', value: '₦42.8M', icon: CreditCard, color: 'bg-green-500', trend: '+12%', isUp: true },
    { label: 'Staff Performance', value: '92%', icon: TrendingUp, color: 'bg-secondary', trend: '-1.2%', isUp: false },
    { label: 'Security Status', value: 'Protected', icon: ShieldCheck, color: 'bg-blue-500', trend: 'Active', isUp: true },
  ];

  return (
    <PortalLayout role="admin" title="Admin Control Center" user={user}>
      <div className="space-y-8">
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className={`${card.color} w-12 h-12 rounded-2xl text-white flex-center mb-6 shadow-lg shadow-${card.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{card.label}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold text-primary">{card.value}</h3>
                    <span className={`flex items-center gap-0.5 text-xs font-bold mb-1 ${card.isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {card.trend}
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-bg-soft rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Admissions */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
            <div className="p-8 flex-between items-center border-b border-border/50">
              <h3 className="text-xl font-bold text-primary">Recent Admissions</h3>
              <button className="text-primary font-bold text-sm bg-bg-soft px-4 py-2 rounded-xl">Export List</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <th className="px-8 py-4">Student</th>
                    <th className="px-8 py-4">Class</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {[
                    { name: 'John Peterson', id: 'PP/26/102', class: 'JSS 1', status: 'Approved', date: '10 May 2026' },
                    { name: 'Sarah Wilson', id: 'PP/26/103', class: 'Primary 3', status: 'Pending', date: '09 May 2026' },
                    { name: 'Daniel Kojo', id: 'PP/26/104', class: 'SSS 2', status: 'Approved', date: '08 May 2026' },
                    { name: 'Aisha Musa', id: 'PP/26/105', class: 'Nursery 2', status: 'Approved', date: '08 May 2026' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-bg-soft/30 transition-colors">
                      <td className="px-8 py-5">
                        <div>
                          <p className="font-bold text-primary text-sm">{row.name}</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase">{row.id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-primary">{row.class}</td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                          row.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-secondary/20 text-primary'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-text-muted font-medium">{row.date}</td>
                      <td className="px-8 py-5">
                        <button className="text-text-muted hover:text-primary"><MoreVertical size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-bg-soft/20 text-center">
              <button className="text-primary font-bold text-sm hover:underline">View All Admissions</button>
            </div>
          </div>

          {/* System Health / Revenue Chart Placeholder */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Term Highlights</h3>
            <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden h-fit">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6">Revenue Growth</h4>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-bold font-baloo">₦12.5M</span>
                <span className="text-secondary text-sm font-bold mb-1.5">+15% vs Last Term</span>
              </div>
              <div className="flex items-end gap-1 h-32">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="flex-1 bg-white/10 rounded-t-lg group relative cursor-pointer hover:bg-secondary transition-all" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}%
                      </div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-white/40">
                <span>JAN</span>
                <span>MAR</span>
                <span>MAY</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-border/50 p-8 shadow-sm">
              <h4 className="text-primary font-bold mb-6">Quick Actions</h4>
              <div className="space-y-3">
                 <button className="w-full py-4 px-6 bg-bg-soft border border-border/50 rounded-2xl text-left text-sm font-bold text-primary hover:bg-secondary hover:border-secondary transition-all">Generate Term Report</button>
                 <button className="w-full py-4 px-6 bg-bg-soft border border-border/50 rounded-2xl text-left text-sm font-bold text-primary hover:bg-secondary hover:border-secondary transition-all">Manage Staff Access</button>
                 <button className="w-full py-4 px-6 bg-bg-soft border border-border/50 rounded-2xl text-left text-sm font-bold text-primary hover:bg-secondary hover:border-secondary transition-all">Global Announcement</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
