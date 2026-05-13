import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';

const AdminClasses = () => {
  const { showToast } = useToast();
  const { sendNotification } = useNotifications();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    section: 'Primary',
    teacherId: '',
    subject: ''
  });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedClassForSubjects, setSelectedClassForSubjects] = useState(null);
  const [classAssignments, setClassAssignments] = useState([]);
  const [assignmentFormData, setAssignmentFormData] = useState({ subject: '', teacherId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const classSnap = await getDocs(collection(db, 'classes'));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
      const teacherSnap = await getDocs(q);
      setTeachers(teacherSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const subSnap = await getDocs(collection(db, 'subjects'));
      setSubjects(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (classId) => {
    try {
      const q = query(collection(db, 'assignments'), where('classId', '==', classId));
      const snap = await getDocs(q);
      setClassAssignments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveClass = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
      
      if (editingClass) {
        await updateDoc(doc(db, 'classes', editingClass.id), {
          name: formData.name,
          section: formData.section,
          teacherId: formData.teacherId,
          teacherName: selectedTeacher?.fullName || 'Unassigned',
          subject: formData.subject
        });

        if (formData.teacherId && formData.teacherId !== editingClass.teacherId) {
          await sendNotification(
            formData.teacherId,
            `You have been assigned as the Class Teacher for ${formData.name}.`,
            'info',
            '/portal/teacher/classes'
          );
        }
      } else {
        const classId = formData.name.replace(/\s+/g, '-').toLowerCase();
        await setDoc(doc(db, 'classes', classId), {
          name: formData.name,
          section: formData.section,
          teacherId: formData.teacherId,
          teacherName: selectedTeacher?.fullName || 'Unassigned',
          subject: formData.subject,
          createdAt: new Date().toISOString()
        });

        if (formData.teacherId) {
          await sendNotification(
            formData.teacherId,
            `You have been assigned as the Class Teacher for ${formData.name}.`,
            'info',
            '/portal/teacher/classes'
          );
        }
      }

      setShowModal(false);
      setEditingClass(null);
      setFormData({ name: '', section: 'Primary', teacherId: '', subject: '' });
      fetchData();
    } catch (err) {
      showToast("Error saving class: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const teacher = teachers.find(t => t.id === assignmentFormData.teacherId);
      const assignmentId = `${selectedClassForSubjects.id}-${assignmentFormData.subject.replace(/\s+/g, '-').toLowerCase()}`;
      
      await setDoc(doc(db, 'assignments', assignmentId), {
        classId: selectedClassForSubjects.id,
        className: selectedClassForSubjects.name,
        teacherId: assignmentFormData.teacherId,
        teacherName: teacher?.fullName || 'N/A',
        subject: assignmentFormData.subject,
        createdAt: new Date().toISOString()
      });

      await sendNotification(
        assignmentFormData.teacherId,
        `You have been assigned to teach ${assignmentFormData.subject} in ${selectedClassForSubjects.name}.`,
        'info',
        '/portal/teacher/classes'
      );

      setAssignmentFormData({ subject: '', teacherId: '' });
      fetchAssignments(selectedClassForSubjects.id);
    } catch (err) { showToast("Error assigning subject: " + err.message, "error"); }
    finally { setIsSubmitting(false); }
  };

  const seedClasses = async () => {
    if (!window.confirm("Initialize standard classes (Nursery 1 to SS3)?")) return;
    setLoading(true);
    const standardClasses = [
      { name: 'Nursery 1', section: 'Nursery' },
      { name: 'Nursery 2', section: 'Nursery' },
      { name: 'Primary 1', section: 'Primary' },
      { name: 'Primary 2', section: 'Primary' },
      { name: 'Primary 3', section: 'Primary' },
      { name: 'Primary 4', section: 'Primary' },
      { name: 'Primary 5', section: 'Primary' },
      { name: 'Primary 6', section: 'Primary' },
      { name: 'JSS 1', section: 'Secondary' },
      { name: 'JSS 2', section: 'Secondary' },
      { name: 'JSS 3', section: 'Secondary' },
      { name: 'SS 1', section: 'Secondary' },
      { name: 'SS 2', section: 'Secondary' },
      { name: 'SS 3', section: 'Secondary' },
    ];

    try {
      for (const cls of standardClasses) {
        const id = cls.name.replace(/\s+/g, '-').toLowerCase();
        await setDoc(doc(db, 'classes', id), {
          ...cls,
          teacherId: '',
          teacherName: 'Unassigned',
          subject: 'General',
          createdAt: new Date().toISOString()
        });
      }
      fetchData();
    } catch (err) {
      showToast("Error seeding classes: " + err.message, "error");
    }
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      section: cls.section,
      teacherId: cls.teacherId,
      subject: cls.subject || ''
    });
    setShowModal(true);
  };

  const openSubjectModal = (cls) => {
    setSelectedClassForSubjects(cls);
    fetchAssignments(cls.id);
    setShowSubjectModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input type="text" placeholder="Search classes..." className="w-full bg-white border border-border/50 pl-11 pr-4 py-3 rounded-2xl outline-none focus:border-primary shadow-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={seedClasses} className="btn btn-outline py-3 px-6 rounded-2xl text-xs font-bold">
            Quick Seed (Nursery - SS3)
          </button>
          <button onClick={() => { setEditingClass(null); setFormData({ name: '', section: 'Primary', teacherId: '', subject: '' }); setShowModal(true); }} className="btn btn-primary py-3 px-6 rounded-2xl flex items-center gap-2">
            <Plus size={18} /> New Class
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-bg-soft p-4 rounded-2xl">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(cls)} className="p-2 hover:bg-bg-soft rounded-xl text-primary"><Edit2 size={16} /></button>
                  <button onClick={async () => { if(window.confirm("Delete class?")) { await deleteDoc(doc(db, 'classes', cls.id)); fetchData(); } }} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">{cls.name}</h3>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-6">{cls.section || 'General'}</p>
              
              <div className="space-y-4 pt-6 border-t border-border/50 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex-center text-primary font-bold text-xs uppercase">
                    {cls.teacherName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase">Class Teacher</p>
                    <p className="text-sm font-bold text-primary">{cls.teacherName}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => openSubjectModal(cls)}
                className="w-full mt-6 py-3 bg-bg-soft hover:bg-primary hover:text-white rounded-2xl text-xs font-bold text-primary transition-all flex-center gap-2"
              >
                Manage Subjects & Teachers <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subject Management Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-[110] flex-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-primary">Subjects & Teachers</h3>
                <p className="text-sm text-text-muted">{selectedClassForSubjects?.name}</p>
              </div>
              <button onClick={() => setShowSubjectModal(false)}><X size={24} /></button>
            </div>

            <form onSubmit={handleAddAssignment} className="bg-bg-soft p-6 rounded-3xl grid md:grid-cols-3 gap-4 items-end mb-8">
              <div className="space-y-2">
                <label htmlFor="assignment-subject" className="text-[10px] font-bold text-primary uppercase">Subject</label>
                <select id="assignment-subject" name="subject" required className="w-full bg-white border border-border/50 p-3 rounded-xl text-sm appearance-none" value={assignmentFormData.subject} onChange={(e) => setAssignmentFormData({...assignmentFormData, subject: e.target.value})}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="assignment-teacher" className="text-[10px] font-bold text-primary uppercase">Teacher</label>
                <select id="assignment-teacher" name="teacherId" required className="w-full bg-white border border-border/50 p-3 rounded-xl text-sm" value={assignmentFormData.teacherId} onChange={(e) => setAssignmentFormData({...assignmentFormData, teacherId: e.target.value})}>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary py-3 rounded-xl font-bold text-sm">
                Assign Subject
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Current Assignments</h4>
              {classAssignments.length > 0 ? classAssignments.map((asg) => (
                <div key={asg.id} className="flex-between items-center p-4 bg-white border border-border/50 rounded-2xl">
                  <div>
                    <p className="font-bold text-primary text-sm">{asg.subject}</p>
                    <p className="text-xs text-text-muted">{asg.teacherName}</p>
                  </div>
                  <button onClick={async () => { await deleteDoc(doc(db, 'assignments', asg.id)); fetchAssignments(selectedClassForSubjects.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              )) : (
                <p className="text-xs text-text-muted italic p-4 text-center">No subject assignments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-primary">{editingClass ? 'Edit' : 'Create'} Class</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveClass} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="class-name" className="text-sm font-bold text-primary">Class Name</label>
                <input id="class-name" name="name" required type="text" placeholder="e.g. Primary 1 Ruby" className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl outline-none focus:border-primary" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label htmlFor="class-section" className="text-sm font-bold text-primary">Section</label>
                <select id="class-section" name="section" className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})}>
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="class-teacher" className="text-sm font-bold text-primary">Class Teacher</label>
                <select id="class-teacher" name="teacherId" className="w-full bg-bg-soft border border-border/50 p-4 rounded-2xl" value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})}>
                  <option value="">Select a Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-4 rounded-2xl font-bold flex-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {isSubmitting ? 'Saving...' : 'Confirm Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;
