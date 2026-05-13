import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Loader2, 
  CheckCircle2, 
  X,
  ChevronRight,
  BookOpen,
  ClipboardList,
  Target,
  FileText,
  Save,
  ArrowLeft
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherCurriculum = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [topicFormData, setTopicFormData] = useState({
    title: '',
    objectives: '',
    content: '',
    quizId: '',
    order: 0
  });

  useEffect(() => {
    if (!user?.uid) return;

    // Real-time listener for teacher's assigned courses
    const qAssignments = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
    const unsubscribeCourses = onSnapshot(qAssignments, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        name: doc.data().subject // Map subject to name for UI consistency
      })));
      setLoading(false);
    });

    // Fetch all assessments for quiz selection
    const fetchQuizzes = async () => {
      const qSnap = await getDocs(query(collection(db, 'quizzes'), where('teacherId', '==', user.uid)));
      setQuizzes(qSnap.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
    };
    fetchQuizzes();

    return () => unsubscribeCourses();
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;

    // Real-time listener for topics in selected course
    const qTopics = query(
      collection(db, 'topics'), 
      where('courseId', '==', selectedCourse.id),
      orderBy('order', 'asc')
    );
    const unsubscribeTopics = onSnapshot(qTopics, (snapshot) => {
      setTopics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeTopics();
  }, [selectedCourse]);

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const topicData = {
        ...topicFormData,
        courseId: selectedCourse.id,
        updatedAt: serverTimestamp(),
        order: Number(topicFormData.order) || 0
      };

      if (editingTopic) {
        await updateDoc(doc(db, 'topics', editingTopic.id), topicData);
      } else {
        await addDoc(collection(db, 'topics'), {
          ...topicData,
          createdAt: serverTimestamp()
        });
        // Update course topic count
        await updateDoc(doc(db, 'courses', selectedCourse.id), {
          topicCount: (selectedCourse.topicCount || 0) + 1
        });
      }

      setShowTopicModal(false);
      setEditingTopic(null);
      setTopicFormData({ title: '', objectives: '', content: '', quizId: '', order: topics.length });
      showToast("Curriculum topic saved!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTopic = async (topicId) => {
    if (window.confirm('Delete this topic?')) {
      await deleteDoc(doc(db, 'topics', topicId));
      await updateDoc(doc(db, 'courses', selectedCourse.id), {
        topicCount: Math.max(0, (selectedCourse.topicCount || 0) - 1)
      });
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to My Courses
        </button>

        <div className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm space-y-6">
           <div className="flex-between items-start gap-8">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-primary">{selectedCourse.name}</h2>
                 <p className="text-sm text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                    <Target size={16} className="text-secondary" /> {selectedCourse.className}
                 </p>
              </div>
              <button 
                onClick={() => {
                  setEditingTopic(null);
                  setTopicFormData({ title: '', objectives: '', content: '', quizId: '', order: topics.length });
                  setShowTopicModal(true);
                }}
                className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20"
              >
                <Plus size={20} /> Add New Topic
              </button>
           </div>
           
           <div className="p-6 bg-bg-soft/50 rounded-3xl border border-border/30">
              <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">
                 <FileText size={16} className="text-primary" /> Course Objectives
              </div>
              <p className="text-sm font-medium text-primary/80 leading-relaxed italic">
                 {selectedCourse.description || "No general course description provided."}
              </p>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-lg font-black text-primary uppercase tracking-widest pl-4">Course Topics & Syllabus</h3>
           <div className="grid gap-6">
              {topics.map((topic, i) => (
                <div key={topic.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-8 items-center">
                   <div className="h-16 w-16 shrink-0 bg-bg-soft rounded-2xl flex-center text-xl font-black text-primary">
                      {i + 1}
                   </div>
                   <div className="flex-1 space-y-2 text-center md:text-left">
                      <h4 className="text-xl font-bold text-primary">{topic.title}</h4>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                         <span className="text-[10px] font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-widest">
                            {topic.quizId ? "Quiz Linked" : "No Quiz"}
                         </span>
                         <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-3 py-1 rounded-full uppercase tracking-widest">
                            {topic.objectives?.split('\n').length || 0} Objectives
                         </span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setEditingTopic(topic);
                          setTopicFormData({ ...topic });
                          setShowTopicModal(true);
                        }}
                        className="p-4 bg-bg-soft rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => deleteTopic(topic.id)}
                        className="p-4 bg-bg-soft rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                </div>
              ))}
              {topics.length === 0 && (
                <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-border/50 opacity-30 italic">
                   No topics added to this curriculum yet.
                </div>
              )}
           </div>
        </div>

        {/* Topic Modal */}
        <AnimatePresence>
          {showTopicModal && (
            <div className="fixed inset-0 z-[110] flex-center p-6 overflow-y-auto">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTopicModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 space-y-8 my-auto">
                <div className="flex-between items-center border-b border-border/30 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{editingTopic ? 'Edit' : 'Add New'} Topic</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Section Management</p>
                  </div>
                  <button onClick={() => setShowTopicModal(false)} className="p-2 hover:bg-bg-soft rounded-xl transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSaveTopic} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Topic Title</label>
                      <input required type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={topicFormData.title} onChange={e => setTopicFormData({...topicFormData, title: e.target.value})} placeholder="e.g. Introduction to Algebra" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Sequence Order</label>
                      <input required type="number" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={topicFormData.order} onChange={e => setTopicFormData({...topicFormData, order: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Learning Objectives (One per line)</label>
                    <textarea className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium h-24" value={topicFormData.objectives} onChange={e => setTopicFormData({...topicFormData, objectives: e.target.value})} placeholder="Students will be able to..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Topic Content (Detailed Explanation)</label>
                    <textarea required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium h-48" value={topicFormData.content} onChange={e => setTopicFormData({...topicFormData, content: e.target.value})} placeholder="Enter the main instructional content here..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Associate Assessment (Quiz)</label>
                    <select className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={topicFormData.quizId} onChange={e => setTopicFormData({...topicFormData, quizId: e.target.value})}>
                      <option value="">Select a Quiz (Optional)</option>
                      {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
                    </select>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] flex-center gap-3">
                     {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                     {isSubmitting ? 'Saving Topic...' : (editingTopic ? 'Update Topic Content' : 'Add Topic to Curriculum')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-secondary text-white p-4 rounded-2xl shadow-lg shadow-secondary/20">
            <Layers size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">Course Content Manager</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Build your instructional curriculum</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full border-t-[6px] border-t-primary/10 hover:border-t-primary">
            <div className="flex-1 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-bg-soft rounded-xl text-primary">
                     <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{course.className}</span>
               </div>
               
               <div>
                  <h4 className="text-xl font-bold text-primary line-clamp-2">{course.name}</h4>
                  <p className="text-xs text-text-muted mt-2 line-clamp-2">{course.description || "No description provided."}</p>
               </div>

               <div className="flex items-center gap-4 py-4 border-y border-border/30 text-[10px] font-black text-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                     <Layers size={14} className="text-primary" />
                     <span>{course.topicCount || 0} Topics</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setSelectedCourse(course)}
              className="w-full mt-8 py-4 bg-bg-soft hover:bg-primary hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest text-primary transition-all flex-center gap-2"
            >
               Manage Content <ChevronRight size={14} />
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full p-40 text-center opacity-30 italic bg-white rounded-[3rem] border border-dashed border-border/50">
             <Layers size={64} className="mx-auto mb-6 text-primary" />
             <p className="text-xl font-bold">You have no courses assigned.</p>
             <p className="text-sm mt-2">Please contact the admin to map your courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCurriculum;
