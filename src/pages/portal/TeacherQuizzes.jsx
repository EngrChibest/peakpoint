import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Play, 
  Users, 
  Clock, 
  X,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  CalendarDays,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherQuizzes = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractText, setExtractText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    subject: '',
    type: 'Assignment',
    term: 'Term 1',
    targetClassId: '',
    targetClassName: '',
    duration: 30,
    deadline: '',
    active: false,
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }
    ]
  });

  useEffect(() => {
    const q = query(collection(db, 'quizzes'), where('teacherId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const fetchData = async () => {
      const classSnap = await getDocs(collection(db, 'classes'));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const subSnap = await getDocs(collection(db, 'subjects'));
      setSubjects(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const assignSnap = await getDocs(query(collection(db, 'assignments'), where('teacherId', '==', user.id)));
      setAssignments(assignSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();

    return () => unsubscribe();
  }, [user.id]);

  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...newQuiz.questions];
    updated[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...newQuiz.questions];
    updated[qIndex].options[oIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const selectedClass = classes.find(c => c.id === newQuiz.targetClassId);
      const quizData = {
        ...newQuiz,
        targetClassName: selectedClass?.name || 'All Classes',
        teacherId: user.id,
        teacherName: user.name,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'quizzes', editingId), quizData);
      } else {
        await addDoc(collection(db, 'quizzes'), { ...quizData, createdAt: serverTimestamp() });
      }
      
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewQuiz({ 
      title: '', subject: '', type: 'Assignment', term: 'Term 1', targetClassId: '', targetClassName: '', 
      duration: 30, deadline: '', active: false, questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }] 
    });
  };

  const handleEdit = (quiz) => {
    setEditingId(quiz.id);
    setNewQuiz({ ...quiz });
    setShowAddModal(true);
  };

  const smartExtract = () => {
    // Regex to extract questions, options and correct answer
    // Format: 1. Question? A) Op1 B) Op2 C) Op3 D) Op4 Correct: A
    const qBlocks = extractText.split(/\d+\./).filter(b => b.trim());
    const extracted = qBlocks.map(block => {
      const lines = block.trim().split('\n');
      const question = lines[0].trim();
      const options = [];
      let correctAnswer = 0;
      
      block.match(/[A-D]\)\s*([^\n\r]+)/g)?.forEach((opt, i) => {
        options.push(opt.replace(/[A-D]\)\s*/, '').trim());
      });

      const correctMatch = block.match(/Correct:\s*([A-D])/i);
      if (correctMatch) {
        correctAnswer = correctMatch[1].toUpperCase().charCodeAt(0) - 65;
      }

      return { question, options: options.length === 4 ? options : ['', '', '', ''], correctAnswer, points: 1 };
    });

    if (extracted.length > 0) {
      setNewQuiz({ ...newQuiz, questions: extracted });
      setShowExtractModal(false);
      setExtractText('');
    }
  };

  const toggleQuizStatus = async (id, currentStatus) => {
    await updateDoc(doc(db, 'quizzes', id), { active: !currentStatus });
  };

  const deleteQuiz = async (id) => {
    if (window.confirm('Delete this assessment?')) {
      await deleteDoc(doc(db, 'quizzes', id));
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
    <div className="space-y-8 pb-20">
      {/* Subject Assignments Overview */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary flex items-center gap-3">
          <Target className="text-primary" size={24} /> My Subject Assignments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {assignments.length > 0 ? assignments.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-bg-soft p-3 rounded-2xl group-hover:bg-primary/5 transition-colors">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-green-100 text-green-600">Active</span>
              </div>
              <h4 className="text-lg font-bold text-primary mb-1">{item.className}</h4>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{item.subject}</p>
            </div>
          )) : (
            <div className="col-span-full p-10 bg-white rounded-[2.5rem] text-center border border-dashed border-border opacity-50">
              <p className="text-text-muted italic">No subject assignments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <ClipboardList size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">CBT & Assessments</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Create, Edit & Manage Digital Tests</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowExtractModal(true)}
            className="btn btn-outline py-4 px-6 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest border-primary/20"
          >
            <Sparkles size={20} className="text-primary" /> Smart Import
          </button>
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20"
          >
            <Plus size={20} /> Create New Quiz
          </button>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all relative group">
            <div className="p-8 flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="bg-bg-soft p-3 rounded-2xl">
                  <Play className="text-primary" size={24} />
                </div>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${
                  quiz.active ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-bg-soft text-text-muted'
                }`}>
                  {quiz.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{quiz.subject}</span>
                   <span className="text-[10px] font-bold text-text-muted">•</span>
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{quiz.type}</span>
                </div>
                <h4 className="text-lg font-bold text-primary leading-tight line-clamp-2">{quiz.title}</h4>
                <div className="flex items-center gap-3 mt-3">
                   <Target size={14} className="text-primary/40" />
                   <span className="text-[10px] font-bold text-primary/60 uppercase">{quiz.targetClassName} • {quiz.term}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-text-muted" />
                  <span className="text-[10px] font-bold text-text-muted uppercase">{quiz.duration} Mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-text-muted" />
                  <span className="text-[10px] font-bold text-text-muted uppercase">{quiz.deadline ? new Date(quiz.deadline).toLocaleDateString() : 'No Deadline'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg-soft/30 border-t border-border/50 flex gap-2">
              <button 
                onClick={() => handleEdit(quiz)}
                className="p-3 rounded-xl bg-white border border-border/50 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => toggleQuizStatus(quiz.id, quiz.active)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  quiz.active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {quiz.active ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => deleteQuiz(quiz.id)}
                className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
                <h3 className="text-xl font-bold text-primary">{editingId ? 'Edit' : 'New'} Assessment</h3>
                <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveQuiz} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="quiz-title" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Quiz Title</label>
                      <input id="quiz-title" name="title" required type="text" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="quiz-subject" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Subject</label>
                      <select id="quiz-subject" name="subject" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={newQuiz.subject} onChange={e => setNewQuiz({...newQuiz, subject: e.target.value})}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="quiz-type" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Type</label>
                      <select id="quiz-type" name="type" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={newQuiz.type} onChange={e => setNewQuiz({...newQuiz, type: e.target.value})}>
                        <option>Assignment</option><option>CA1</option><option>CA2</option><option>Exam</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="quiz-term" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Term</label>
                      <select id="quiz-term" name="term" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={newQuiz.term} onChange={e => setNewQuiz({...newQuiz, term: e.target.value})}>
                        <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="quiz-class" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Target Class</label>
                      <select id="quiz-class" name="targetClassId" required className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium appearance-none" value={newQuiz.targetClassId} onChange={e => setNewQuiz({...newQuiz, targetClassId: e.target.value})}>
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quiz-duration" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Mins</label>
                        <input id="quiz-duration" name="duration" type="number" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={newQuiz.duration} onChange={e => setNewQuiz({...newQuiz, duration: parseInt(e.target.value)})} />
                      </div>
                      <div>
                        <label htmlFor="quiz-deadline" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Deadline</label>
                        <input id="quiz-deadline" name="deadline" type="date" className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" value={newQuiz.deadline} onChange={e => setNewQuiz({...newQuiz, deadline: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex-between items-center px-2">
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest">Questions & Marking Scheme</h4>
                    <button type="button" onClick={handleAddQuestion} className="flex items-center gap-2 text-primary font-bold text-xs hover:gap-3 transition-all"><PlusCircle size={16} /> Add Question</button>
                  </div>
                  <div className="space-y-6">
                    {newQuiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-bg-soft/30 p-8 rounded-[2rem] border border-border/50 space-y-6 relative">
                        <div className="flex-between items-start">
                           <span className="bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg">Q{qIndex + 1}</span>
                           <div className="flex items-center gap-3">
                              <label htmlFor={`quiz-q-${qIndex}-points`} className="text-[8px] font-black text-text-muted uppercase">Score</label>
                              <input id={`quiz-q-${qIndex}-points`} name={`q-${qIndex}-points`} type="number" className="w-16 bg-white border border-border/50 px-3 py-1 rounded-lg text-xs font-bold" value={q.points} onChange={e => updateQuestion(qIndex, 'points', parseInt(e.target.value))} />
                              <button type="button" onClick={() => { const updated = [...newQuiz.questions]; updated.splice(qIndex, 1); setNewQuiz({...newQuiz, questions: updated}) }} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><Trash2 size={16} /></button>
                           </div>
                        </div>
                        <input id={`quiz-q-${qIndex}-text`} name={`q-${qIndex}-text`} type="text" className="w-full bg-white border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary font-medium" placeholder="Enter question..." value={q.question} onChange={e => updateQuestion(qIndex, 'question', e.target.value)} required />
                        <div className="grid md:grid-cols-2 gap-4">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <input id={`quiz-q-${qIndex}-opt-${oIndex}-radio`} type="radio" checked={q.correctAnswer === oIndex} onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)} className="w-4 h-4 accent-primary" />
                              <input id={`quiz-q-${qIndex}-opt-${oIndex}`} name={`q-${qIndex}-opt-${oIndex}`} type="text" className="flex-1 bg-white border border-border/50 px-5 py-3 rounded-xl outline-none focus:border-primary text-sm font-medium" placeholder={`Option ${String.fromCharCode(65+oIndex)}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} required />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex-center gap-3">
                   <Save size={20} /> {editingId ? 'Save Changes' : 'Confirm & Publish'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smart Import Modal */}
      <AnimatePresence>
        {showExtractModal && (
          <div className="fixed inset-0 z-[110] flex-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExtractModal(false)} className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 space-y-8">
               <div className="flex-between items-center">
                  <div className="flex items-center gap-4">
                    <Sparkles className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-primary">Smart CBT Import</h3>
                  </div>
                  <button onClick={() => setShowExtractModal(false)}><X size={24} /></button>
               </div>
               <div className="space-y-4">
                  <p className="text-xs text-text-muted leading-relaxed">Paste your questions below. Follow this format for best results:<br/><b>1. Question Text A) Opt1 B) Opt2 C) Opt3 D) Opt4 Correct: A</b></p>
                  <textarea className="w-full h-80 bg-bg-soft border border-border/50 p-6 rounded-[2rem] outline-none focus:border-primary font-mono text-sm" placeholder="1. What is 2+2? A) 2 B) 4 C) 6 D) 8 Correct: B" value={extractText} onChange={e => setExtractText(e.target.value)}></textarea>
               </div>
               <button onClick={smartExtract} className="w-full btn btn-primary py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex-center gap-3">
                  <CheckCircle2 size={20} /> Process & Extract Questions
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherQuizzes;
