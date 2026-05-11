import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  UserSquare2, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut,
  Users,
  GraduationCap,
  ClipboardList,
  MessageSquare
} from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ role }) => {
  const location = useLocation();
  
  const navItems = {
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/student' },
      { name: 'My Courses', icon: BookOpen, path: '/portal/student/courses' },
      { name: 'Grades', icon: GraduationCap, path: '/portal/student/grades' },
      { name: 'Fees & Payments', icon: CreditCard, path: '/portal/student/fees' },
      { name: 'Schedule', icon: Calendar, path: '/portal/student/schedule' },
    ],
    teacher: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/teacher' },
      { name: 'My Classes', icon: Users, path: '/portal/teacher/classes' },
      { name: 'Grading', icon: GraduationCap, path: '/portal/teacher/grading' },
      { name: 'Attendance', icon: ClipboardList, path: '/portal/teacher/attendance' },
      { name: 'Resources', icon: BookOpen, path: '/portal/teacher/resources' },
    ],
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/admin' },
      { name: 'User Management', icon: UserSquare2, path: '/portal/admin/users' },
      { name: 'Financials', icon: CreditCard, path: '/portal/admin/finance' },
      { name: 'Academic Calendar', icon: Calendar, path: '/portal/admin/calendar' },
      { name: 'System Logs', icon: ClipboardList, path: '/portal/admin/logs' },
    ]
  };

  const currentItems = navItems[role] || navItems.student;

  return (
    <div className="w-72 bg-white h-screen border-r border-border flex flex-col sticky top-0">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-primary font-bold leading-none">PEAK POINT</h1>
            <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase mt-1">International</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{role} Portal</p>
        </div>
        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-muted hover:bg-bg-soft hover:text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
