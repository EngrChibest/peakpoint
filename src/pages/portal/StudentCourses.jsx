import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  Target,
  FileText,
  ClipboardList,
  Clock,
  PlayCircle
} from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs, orderBy, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const StudentCourses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    let unsubscribeCourses = () => {};

    const fetchStudentAndCourses = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStudentData(data);
          
          if (data.classId) {
            const qAssignments = query(collection(db, 'assignments'), where('classId', '==', data.classId));
            unsubscribeCourses = onSnapshot(qAssignments, (snapshot) => {
              setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
              setLoading(false);
            }, (err) => {
              console.error("Courses subscription error:", err);
              setLoading(false);
            });
          } else {
            console.warn("User has no classId assigned");
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in fetchStudentAndCourses:", err);
        setLoading(false);
      }
    };

    fetchStudentAndCourses();
    return () => unsubscribeCourses();
  }, [user?.uid]);

  useEffect(() => {
    if (!selectedCourse) {
      setTopics([]);
      return;
    }

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

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const startQuiz = async () => {
    if (!selectedTopic.quizId) return;
    try {
      const quizSnap = await getDoc(doc(db, 'quizzes', selectedTopic.quizId));
      if (quizSnap.exists()) {
        setActiveQuiz(quizSnap.data());
        setCurrentQuestionIndex(0);
        setQuizScore(null);
        setAnswers({});
      } else {
        showToast("Quiz content is not yet available for this topic.", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const submitQuiz = async () => {
    setIsSubmittingQuiz(true);
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const finalScore = (score / activeQuiz.questions.length) * 100;
    setQuizScore(finalScore);

    try {
      await addDoc(collection(db, 'quiz_attempts'), {
        userId: user.uid,
        userName: studentData.fullName,
        quizId: selectedTopic.quizId,
        topicId: selectedTopic.id,
        score: finalScore,
        createdAt: new Date().toISOString(),
        courseName: selectedCourse.name,
        topicTitle: selectedTopic.title
      });
    } catch (err) {
      console.error("Error saving quiz result:", err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const resetQuiz = () => {
    setQuizScore(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (activeQuiz) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden">
          <div className="p-8 bg-primary text-white flex-between items-center">
            <div>
              <h3 className="text-xl font-bold">{activeQuiz.title || 'Topic Quiz'}</h3>
              <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-1">{selectedTopic.title}</p>
            </div>
            <button onClick={() => setActiveQuiz(null)} className="text-white/60 hover:text-white transition-colors">
              Exit Quiz
            </button>
          </div>

          <div className="p-12">
            {quizScore !== null ? (
              <div className="text-center space-y-8 py-10">
                <div className="w-40 h-40 rounded-full border-8 border-bg-soft flex-center mx-auto relative">
                   <div className={`absolute inset-0 rounded-full border-8 border-t-secondary transition-all`} style={{ transform: `rotate(${quizScore * 3.6}deg)` }}></div>
                   <p className="text-4xl font-black text-primary">{Math.round(quizScore)}%</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary">{quizScore >= 70 ? 'Excellent Mastery!' : 'Keep Practicing!'}</h4>
                  <p className="text-text-muted font-medium mt-2">You scored {Math.round(quizScore)}% in this topic assessment.</p>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={resetQuiz} className="btn btn-primary py-4 px-10 rounded-2xl font-bold">Retake Quiz</button>
                  <button onClick={() => { setActiveQuiz(null); setSelectedTopic(null); }} className="btn btn-outline py-4 px-10 rounded-2xl font-bold">Finish Lesson</button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex-between items-center">
                   <span className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                   <div className="h-1.5 w-48 bg-bg-soft rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all" style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}></div>
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-2xl font-bold text-primary leading-tight">{activeQuiz.questions[currentQuestionIndex].question}</h4>
                   <div className="grid gap-4">
                      {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleAnswerSelect(currentQuestionIndex, idx)}
                          className={`w-full p-6 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group ${
                            answers[currentQuestionIndex] === idx 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-border/50 hover:border-primary/30'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`h-6 w-6 rounded-full border-2 flex-center transition-all ${
                            answers[currentQuestionIndex] === idx ? 'border-primary bg-primary text-white' : 'border-border group-hover:border-primary/30'
                          }`}>
                             {answers[currentQuestionIndex] === idx && <div className="h-2 w-2 bg-white rounded-full"></div>}
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-border/30">
                   <button 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="btn btn-outline py-4 px-8 rounded-xl font-bold disabled:opacity-30"
                   >
                     Previous
                   </button>
                   {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                     <button 
                      onClick={submitQuiz}
                      disabled={isSubmittingQuiz || answers[currentQuestionIndex] === undefined}
                      className="btn btn-primary py-4 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 flex-center gap-2"
                     >
                       {isSubmittingQuiz ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                       Submit Assessment
                     </button>
                   ) : (
                     <button 
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      disabled={answers[currentQuestionIndex] === undefined}
                      className="btn btn-primary py-4 px-10 rounded-xl font-bold shadow-xl shadow-primary/20 flex-center gap-2 disabled:opacity-50"
                     >
                       Next Question <ChevronRight size={18} />
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedTopic) {
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 max-w-5xl mx-auto">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} /> Back to Syllabus
        </button>

        <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-border/30 bg-bg-soft/30">
              <h2 className="text-3xl font-black text-primary mb-4">{selectedTopic.title}</h2>
              <div className="flex flex-wrap gap-4">
                 <span className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-4 py-2 rounded-full">
                    <Clock size={14} /> Recommended for this week
                 </span>
                 {selectedTopic.quizId && (
                   <Link to="/portal/student/assessments" className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                      <ClipboardList size={14} /> Associated Quiz Available
                   </Link>
                 )}
              </div>
           </div>

           <div className="p-10 space-y-12">
              {/* Learning Objectives */}
              <div className="space-y-6">
                 <h3 className="flex items-center gap-3 text-lg font-black text-primary uppercase tracking-widest">
                    <Target size={20} className="text-secondary" /> Learning Objectives
                 </h3>
                 <div className="grid gap-4">
                    {selectedTopic.objectives?.split('\n').filter(o => o.trim()).map((obj, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-bg-soft/50 rounded-2xl border border-border/30">
                         <div className="h-6 w-6 rounded-full bg-primary text-white flex-center shrink-0 mt-0.5">
                            <CheckCircle2 size={14} />
                         </div>
                         <p className="text-sm font-bold text-primary/80 leading-relaxed">{obj}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Topic Content */}
              <div className="space-y-6">
                 <h3 className="flex items-center gap-3 text-lg font-black text-primary uppercase tracking-widest">
                    <FileText size={20} className="text-secondary" /> Lesson Content
                 </h3>
                 <div className="prose prose-primary max-w-none">
                    <div className="text-primary/80 leading-[1.8] font-medium text-lg whitespace-pre-wrap bg-bg-soft/20 p-8 rounded-[2rem] border border-border/20">
                       {selectedTopic.content}
                    </div>
                 </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-center pt-10 border-t border-border/30">
                 {selectedTopic.quizId ? (
                   <button 
                    onClick={startQuiz}
                    className="btn btn-primary py-5 px-12 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                   >
                     Take Topic Assessment <ChevronRight size={20} />
                   </button>
                 ) : (
                   <button 
                    onClick={() => setSelectedTopic(null)}
                    className="btn btn-outline py-5 px-12 rounded-[2rem] font-black uppercase tracking-widest"
                   >
                     Topic Completed
                   </button>
                 )}
              </div>
           </div>
        </div>
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
          <ArrowLeft size={20} /> Back to My Learning
        </button>

        <div className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm">
           <div className="flex-between items-start gap-8 flex-wrap md:flex-nowrap">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                    <BookOpen size={16} /> Course Syllabus
                 </div>
                 <h2 className="text-3xl font-black text-primary leading-tight">{selectedCourse.subject}</h2>
                 <p className="text-sm text-text-muted font-medium max-w-2xl">{selectedCourse.description}</p>
              </div>
              <div className="bg-bg-soft p-6 rounded-[2rem] text-center min-w-[150px]">
                 <p className="text-3xl font-black text-primary">{topics.length}</p>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Topics</p>
              </div>
           </div>
        </div>

        <div className="grid gap-6">
           {topics.map((topic, i) => (
             <div 
               key={topic.id} 
               onClick={() => setSelectedTopic(topic)}
               className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-8 items-center cursor-pointer group"
             >
                <div className="h-16 w-16 shrink-0 bg-bg-soft rounded-2xl flex-center text-xl font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
                   {i + 1}
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                   <h4 className="text-xl font-bold text-primary group-hover:text-primary transition-colors">{topic.title}</h4>
                   <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1">
                         <Target size={12} /> {topic.objectives?.split('\n').length || 0} Learning Goals
                      </span>
                      {topic.quizId && (
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                           <ClipboardList size={12} /> Assessment Available
                        </span>
                      )}
                   </div>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl text-primary group-hover:translate-x-2 transition-all">
                   <PlayCircle size={24} />
                </div>
             </div>
           ))}
           {topics.length === 0 && (
             <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-border/50 opacity-30 italic">
                <Layers size={48} className="mx-auto mb-4" />
                Syllabus content is being updated by your teacher.
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">My Learning Journey</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Explore your academic curriculum</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden flex flex-col h-full">
            <div className="flex-1 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="p-4 bg-bg-soft rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                     <Layers size={24} />
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Instructor</p>
                     <p className="text-xs font-bold text-primary">{course.teacherName}</p>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-xl font-bold text-primary leading-tight group-hover:text-primary transition-colors">{course.subject}</h4>
                  <p className="text-xs text-text-muted mt-3 line-clamp-3 font-medium leading-relaxed">{course.description || "Start exploring the detailed curriculum for this course."}</p>
               </div>

               <div className="flex items-center gap-4 py-4 border-t border-border/30 text-[10px] font-black text-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-secondary"></div>
                     <span>{course.topicCount || 0} Lessons</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setSelectedCourse(course)}
              className="w-full mt-8 py-5 bg-bg-soft hover:bg-primary hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest text-primary transition-all flex-center gap-2 shadow-sm"
            >
               Open Course Syllabus <ChevronRight size={16} />
            </button>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full p-40 text-center opacity-30 italic bg-white rounded-[3rem] border border-dashed border-border/50">
             <BookOpen size={64} className="mx-auto mb-6 text-primary" />
             <p className="text-xl font-bold">No courses found for your class.</p>
             <p className="text-sm mt-2">Check back soon or contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
