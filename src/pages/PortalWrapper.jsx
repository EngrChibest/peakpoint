import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PortalLayout from '../components/portal/PortalLayout';
import { Loader2 } from 'lucide-react';

// Admin Views
import AdminDashboard from './portal/AdminDashboard';
import AdminUsers from './portal/AdminUsers';
import AdminClasses from './portal/AdminClasses';
import AdminFinance from './portal/AdminFinance';
import AdminTimetable from './portal/AdminTimetable';
import AdminCalendar from './portal/AdminCalendar';
import AdminLogs from './portal/AdminLogs';
import AdminAnnouncements from './portal/AdminAnnouncements';
import AdminApplications from './portal/AdminApplications';
import AdminInquiries from './portal/AdminInquiries';
import Library from './portal/Library';
import AdminLibrary from './portal/AdminLibrary';
import AdminSubjects from './portal/AdminSubjects';
import AdminCurriculum from './portal/AdminCurriculum';

// Teacher Views
import TeacherDashboard from './portal/TeacherDashboard';
import TeacherGrading from './portal/TeacherGrading';
import TeacherTimetable from './portal/TeacherTimetable';
import TeacherAttendance from './portal/TeacherAttendance';
import TeacherResources from './portal/TeacherResources';
import TeacherClasses from './portal/TeacherClasses';
import TeacherCurriculum from './portal/TeacherCurriculum';

// Student Views
import StudentDashboard from './portal/StudentDashboard';
import StudentTimetable from './portal/StudentSchedule';
import StudentGrades from './portal/StudentGrades';
import StudentFees from './portal/StudentFees';
import StudentCourses from './portal/StudentCourses';
import TeacherQuizzes from './portal/TeacherQuizzes';
import StudentQuizzes from './portal/StudentQuizzes';
import AlertsView from './portal/AlertsView';
import ProfileSettings from './portal/ProfileSettings';

// Parent Views
import ParentDashboard from './portal/ParentDashboard';
import ParentChildDetails from './portal/ParentChildDetails';

const PortalWrapper = ({ role }) => {
  const { currentUser, userData, loading } = useAuth();
  const { tab } = useParams();
  const [selectedChild, setSelectedChild] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-soft">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!currentUser || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = {
    uid: currentUser.uid,
    name: userData?.fullName || 'User',
    id: userData?.portalId || 'PPIS',
    role: userData?.role || role,
    avatar: userData?.avatar || '',
    classId: userData?.classId || ''
  };

  const renderView = () => {
    if (role === 'admin') {
      switch (tab) {
        case 'users': return <AdminUsers user={user} />;
        case 'classes': return <AdminClasses user={user} />;
        case 'finance': return <AdminFinance user={user} />;
        case 'timetable': return <AdminTimetable user={user} />;
        case 'calendar': return <AdminCalendar user={user} />;
        case 'logs': return <AdminLogs user={user} />;
        case 'announcements': return <AdminAnnouncements user={user} />;
        case 'applications': return <AdminApplications user={user} />;
        case 'inquiries': return <AdminInquiries user={user} />;
        case 'library': return <AdminLibrary user={user} />;
        case 'subjects': return <AdminSubjects user={user} />;
        case 'curriculum': return <AdminCurriculum user={user} />;
        case 'alerts': return <AlertsView user={user} />;
        case 'settings': return <ProfileSettings user={user} />;
        default: return <AdminDashboard user={user} />;
      }
    }
    if (role === 'teacher') {
      switch (tab) {
        case 'grading': return <TeacherGrading user={user} />;
        case 'timetable': return <TeacherTimetable user={user} />;
        case 'attendance': return <TeacherAttendance user={user} />;
        case 'resources': return <TeacherResources user={user} />;
        case 'classes': return <TeacherClasses user={user} />;
        case 'curriculum': return <TeacherCurriculum user={user} />;
        case 'assessments': return <TeacherQuizzes user={user} />;
        case 'alerts': return <AlertsView user={user} />;
        case 'settings': return <ProfileSettings user={user} />;
        default: return <TeacherDashboard user={user} />;
      }
    }
    if (role === 'student') {
      switch (tab) {
        case 'timetable': return <StudentTimetable user={user} />;
        case 'grades': return <StudentGrades user={user} />;
        case 'fees': return <StudentFees user={user} />;
        case 'courses': return <StudentCourses user={user} />;
        case 'library': return <Library user={user} />;
        case 'assessments': return <StudentQuizzes user={user} />;
        case 'alerts': return <AlertsView user={user} />;
        case 'settings': return <ProfileSettings user={user} />;
        default: return <StudentDashboard user={user} />;
      }
    }
    if (role === 'parent') {
      switch (tab) {
        case 'details': return <ParentChildDetails user={user} />;
        case 'calendar': return <AdminCalendar user={user} />;
        case 'alerts': return <AlertsView user={user} />;
        case 'settings': return <ProfileSettings user={user} />;
        default:
          if (selectedChild) {
            return <ParentChildDetails child={selectedChild} onBack={() => setSelectedChild(null)} />;
          }
          return <ParentDashboard user={user} onSelectChild={setSelectedChild} />;
      }
    }
    return <Navigate to="/" />;
  };

  const getTitle = () => {
    const tabNames = {
      users: 'User Management',
      classes: 'Class Management',
      finance: 'Financials',
      timetable: 'Time Table',
      calendar: 'Academic Calendar',
      logs: 'System Logs',
      announcements: 'School Announcements',
      applications: 'Admissions & Applications',
      inquiries: 'Website Inquiries',
      grading: 'Grading & Assessments',
      attendance: 'Attendance',
      resources: 'Resources',
      grades: 'Academic Grades',
      fees: 'Fees & Payments',
      courses: 'My Courses',
      library: 'Digital Library Catalog',
      assessments: 'Online Assessments (CBT)',
      alerts: 'Institutional Alerts',
      settings: 'Profile & Account Settings',
      subjects: 'Academic Subject Registry',
      curriculum: 'Academic Curriculum Mapping'
    };
    return tabNames[tab] || `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;
  };

  return (
    <PortalLayout role={role} title={getTitle()} user={user}>
      {renderView()}
    </PortalLayout>
  );
};

export default PortalWrapper;
