import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  X, 
  Loader2, 
  CheckCircle2, 
  Edit2, 
  Trash2,
  Layers,
  GraduationCap,
  Users,
  ChevronRight
} from 'lucide-react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCurriculum = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    classId: '', 
    subjectId: '', 
    teacherId: '',
    description: '' 
  });

  useEffect(() => {
    // Real-time listener for courses
    const qCourses = query(collection(db, 'courses'));
    const unsubscribeCourses = onSnapshot(qCourses, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Fetch classes, subjects, and teachers
    const fetchData = async () => {
      const classSnap = await getDocs(collection(db, 'classes'));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const subSnap = await getDocs(collection(db, 'subjects'));
      setSubjects(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const teacherSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher')));
      setTeachers(teacherSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();

    return () => unsubscribeCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedClass = classes.find(c => c.id === formData.classId);
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      const selectedTeacher = teachers.find(t => t.id === formData.teacherId);

      const courseData = {
        ...formData,
        className: selectedClass?.name || 'Unknown Class',
        subjectName: selectedSubject?.name || 'Unknown Subject',
        teacherName: selectedTeacher?.fullName || 'Unassigned',
        updatedAt: serverTimestamp()
      };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
      } else {
        await addDoc(collection(db, 'courses'), {
          ...courseData,
          createdAt: serverTimestamp(),
          topicCount: 0
        });
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ name: '', classId: '', subjectId: '', teacherId: '', description: '' });
      showToast("Course saved successfully!", "success");
    } catch (err) {
      showToast("Error saving course: " + err.message, "error");
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Delete this course? This will remove all associated curriculum content.')) {
      await deleteDoc(doc(db, 'courses', id));
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[3rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <Layers size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">Curriculum Management</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Map Courses to Classes & Teachers</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingCourse(null); setFormData({ name: '', classId: '', subjectId: '', teacherId: '', description: '' }); setShowModal(true); }}
          className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10 group-hover:bg-primary transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-bg-soft rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <BookOpen size={24} />
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => { setEditingCourse(course); setFormData({ ...course }); setShowModal(true); }} className="p-2 hover:bg-bg-soft rounded-xl text-primary"><Edit2 size={16} /></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500"><Trash2 size={16} /></button>
               </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-primary mb-1 line-clamp-1">{course.name}</h4>
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{course.className}</p>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-border/30">
                 <div className="h-10 w-10 rounded-full bg-primary/10 flex-center text-primary font-bold text-xs">
                    {course.teacherName?.charAt(0)}
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Instructor</p>
                    <p className="text-sm font-bold text-primary">{course.teacherName}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                 <div className="flex items-center gap-2">
                    <Layers size={14} className="text-primary" />
                    <span>{course.topicCount || 0} Topics Defined</span>
                 </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-bg-soft hover:bg-primary hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest text-primary transition-all flex-center gap-2">
               View Full Curriculum <ChevronRight size={14} />
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full p-40 text-center opacity-30 italic bg-white rounded-[3rem] border border-dashed border-border/50">
             <Layers size={64} className="mx-auto mb-6" />
             <p className="text-xl">No courses mapped in the curriculum yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 space-y-8 my-auto">
              <div className="flex-between items-center">
                <h3 className="text-xl font-bold text-primary">{editingCourse ? 'Edit' : 'Create'} Course</h3>
                <button onClick={() => setShowModal(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="course-name" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Course Display Name</label>
                  <input id="course-name" name="name" required type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mathematics Primary 1" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="course-class" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Target Class</label>
                    <select id="course-class" name="classId" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="course-subject" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Core Subject</label>
                    <select id="course-subject" name="subjectId" required className="w-full bg-white border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="course-teacher" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Assigned Teacher</label>
                  <select id="course-teacher" name="teacherId" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})}>
                    <option value="">Select Teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="course-description" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Course Overview</label>
                  <textarea id="course-description" name="description" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="General course objectives and details..."></textarea>
                </div>

                <button type="submit" className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                   {editingCourse ? 'Update Mapping' : 'Initialize Course'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCurriculum;
