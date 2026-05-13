import React from 'react';
import { ClipboardList, Shield, User, Search, Filter, Download } from 'lucide-react';

const AdminLogs = () => {
  const logs = [
    { event: 'User Login', user: 'Chibest Engr', id: 'PP/26/102', time: '12:45 PM', type: 'info', icon: User },
    { event: 'Grade Finalized', user: 'Mrs. Adebayo', id: 'PP/TCH/012', time: '11:20 AM', type: 'success', icon: ClipboardList },
    { event: 'Failed Login Attempt', user: 'Unknown', id: '192.168.1.1', time: '10:15 AM', type: 'warning', icon: Shield },
    { event: 'System Config Update', user: 'Admin Principal', id: 'PP/ADM/001', time: '09:00 AM', type: 'info', icon: ClipboardList },
    { event: 'New Admission Registered', user: 'Admin Principal', id: 'PP/ADM/001', time: 'Yesterday', type: 'success', icon: User },
  ];

  return (
    <div className="space-y-8">
      {/* Logs Summary */}
      <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Today's Events</p>
            <h3 className="text-3xl font-bold text-primary">1,248</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm border-l-8 border-l-red-500">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Security Alerts</p>
            <h3 className="text-3xl font-bold text-red-500">12</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm border-l-8 border-l-green-500">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">System Status</p>
            <h3 className="text-3xl font-bold text-green-500">Healthy</h3>
          </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 flex-between items-center border-b border-border/50">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input type="text" placeholder="Filter by event or user..." className="w-full bg-bg-soft pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-primary transition-all" />
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 rounded-xl bg-bg-soft text-text-muted hover:text-primary transition-all"><Filter size={20} /></button>
            <button className="btn btn-outline py-2.5 px-6 text-sm flex items-center gap-2"><Download size={18} /> Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <th className="px-8 py-4">Event Details</th>
                <th className="px-8 py-4">Origin User</th>
                <th className="px-8 py-4">Time</th>
                <th className="px-8 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {logs.map((log, i) => {
                const Icon = log.icon;
                return (
                  <tr key={i} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${
                          log.type === 'warning' ? 'bg-red-50 text-red-500' : 
                          log.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-bg-soft text-primary'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <span className="font-bold text-primary text-sm">{log.event}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-primary text-sm">{log.user}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase">{log.id}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-text-muted font-medium">{log.time}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter ${
                        log.type === 'warning' ? 'text-red-600 bg-red-100' : 
                        log.type === 'success' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
