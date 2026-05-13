import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  MessageSquare,
  Book,
  Bell,
  Layers,
  X
} from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ role, isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };
  
  // Close sidebar on navigation on mobile
  const handleNavClick = (path) => {
    if (window.innerWidth < 1024) onClose();
  };
  
  const navItems = {
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/student' },
      { name: 'My Learning', icon: BookOpen, path: '/portal/student/courses' },
      { name: 'Grades', icon: GraduationCap, path: '/portal/student/grades' },
      { name: 'Fees & Payments', icon: CreditCard, path: '/portal/student/fees' },
      { name: 'Time Table', icon: Calendar, path: '/portal/student/timetable' },
      { name: 'Assessments', icon: ClipboardList, path: '/portal/student/assessments' },
      { name: 'Digital Library', icon: Book, path: '/portal/student/library' },
      { name: 'Alerts', icon: Bell, path: '/portal/student/alerts' },
      { name: 'Profile Settings', icon: Settings, path: '/portal/student/settings' },
    ],
    teacher: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/teacher' },
      { name: 'My Classes', icon: Users, path: '/portal/teacher/classes' },
      { name: 'Course Content', icon: Layers, path: '/portal/teacher/curriculum' },
      { name: 'Grading', icon: GraduationCap, path: '/portal/teacher/grading' },
      { name: 'Time Table', icon: Calendar, path: '/portal/teacher/timetable' },
      { name: 'Attendance', icon: ClipboardList, path: '/portal/teacher/attendance' },
      { name: 'Resources', icon: BookOpen, path: '/portal/teacher/resources' },
      { name: 'Assessments', icon: ClipboardList, path: '/portal/teacher/assessments' },
      { name: 'Alerts', icon: Bell, path: '/portal/teacher/alerts' },
      { name: 'Profile Settings', icon: Settings, path: '/portal/teacher/settings' },
    ],
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/admin' },
      { name: 'User Management', icon: UserSquare2, path: '/portal/admin/users' },
      { name: 'Class Management', icon: BookOpen, path: '/portal/admin/classes' },
      { name: 'Subject Registry', icon: Book, path: '/portal/admin/subjects' },
      { name: 'Curriculum', icon: Layers, path: '/portal/admin/curriculum' },
      { name: 'Financials', icon: CreditCard, path: '/portal/admin/finance' },
      { name: 'Time Table', icon: Calendar, path: '/portal/admin/timetable' },
      { name: 'Academic Calendar', icon: ClipboardList, path: '/portal/admin/calendar' },
      { name: 'Announcements', icon: MessageSquare, path: '/portal/admin/announcements' },
      { name: 'Admissions', icon: GraduationCap, path: '/portal/admin/applications' },
      { name: 'Inquiries', icon: MessageSquare, path: '/portal/admin/inquiries' },
      { name: 'Digital Library', icon: Book, path: '/portal/admin/library' },
      { name: 'Alerts', icon: Bell, path: '/portal/admin/alerts' },
      { name: 'Profile Settings', icon: Settings, path: '/portal/admin/settings' },
    ],
    parent: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/parent' },
      { name: 'Academic Calendar', icon: Calendar, path: '/portal/parent/calendar' },
      { name: 'Alerts', icon: Bell, path: '/portal/parent/alerts' },
      { name: 'Profile Settings', icon: Settings, path: '/portal/parent/settings' },
    ]
  };

  const currentItems = navItems[role] || navItems.student;

  return (
    <div className={`fixed lg:sticky top-0 left-0 z-[60] w-72 bg-white h-screen border-r border-border flex flex-col shrink-0 shadow-2xl lg:shadow-xl shadow-primary/5 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 shrink-0 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-primary font-bold leading-none">PEAK POINT</h1>
            <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase mt-1">International</p>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-2 hover:bg-bg-soft rounded-xl text-text-muted">
           <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
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
              onClick={() => handleNavClick(item.path)}
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

      <div className="p-4 border-t border-border shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
