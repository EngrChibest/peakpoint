import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Play, 
  Clock, 
  Award, 
  CheckCircle2, 
  Loader2,
  Timer,
  ChevronRight,
  ChevronLeft,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  where, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const StudentQuizzes = ({ user }) => {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch Active Quizzes
    const q = query(collection(db, 'quizzes'), where('active', '==', true));
    const unsubQuizzes = onSnapshot(q, (snapshot) => {
      setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch My Attempts
    const aq = query(
      collection(db, 'quiz_attempts'), 
      where('userId', '==', user.id)
    );
    const unsubAttempts = onSnapshot(aq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in-memory to avoid index requirement
      data.sort((a, b) => {
        const timeA = a.completedAt?.toMillis ? a.completedAt.toMillis() : 0;
        const timeB = b.completedAt?.toMillis ? b.completedAt.toMillis() : 0;
        return timeB - timeA;
      });
      setAttempts(data);
      setLoading(false);
    });

    return () => {
      unsubQuizzes();
      unsubAttempts();
    };
  }, [user.id]);

  // Timer logic
  useEffect(() => {
    if (activeQuiz && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (activeQuiz && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [activeQuiz, timeLeft]);

  const startQuiz = (quiz) => {
    if (attempts.find(a => a.quizId === quiz.id)) {
      showToast('You have already completed this assessment.', "info");
      return;
    }
    setActiveQuiz(quiz);
    setTimeLeft(quiz.duration * 60);
    setAnswers({});
    setCurrentQuestion(0);
  };

  const handleSelectOption = (oIndex) => {
    setAnswers({ ...answers, [currentQuestion]: oIndex });
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Calculate Score
    let score = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    try {
      await addDoc(collection(db, 'quiz_attempts'), {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        userId: user.id,
        userName: user.name,
        score,
        totalMarks: activeQuiz.questions.length,
        completedAt: serverTimestamp()
      });
      showToast(`Assessment completed! Your score: ${score}/${activeQuiz.questions.length}`, "success");
      setActiveQuiz(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Active Assessments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary px-2 flex items-center gap-3">
          <Play size={24} className="text-secondary" /> Active Assessments
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => {
            const isDone = attempts.find(a => a.quizId === quiz.id);
            return (
              <div key={quiz.id} className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all group">
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-bg-soft p-3 rounded-2xl group-hover:bg-primary/5 transition-colors">
                      <ClipboardList className="text-primary" size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{quiz.subject}</span>
                      {isDone && <CheckCircle2 className="text-green-500" size={20} />}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-6 leading-tight line-clamp-2">{quiz.title}</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-text-muted" />
                      <span className="text-xs font-bold text-text-muted">{quiz.duration} Mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-text-muted" />
                      <span className="text-xs font-bold text-text-muted">{quiz.questions?.length} Marks</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-bg-soft/30 border-t border-border/50">
                  <button 
                    onClick={() => startQuiz(quiz)}
                    disabled={isDone}
                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isDone ? 'bg-bg-soft text-border' : 'bg-primary text-white shadow-lg shadow-primary/10 hover:scale-105'
                    }`}
                  >
                    {isDone ? 'Assessment Completed' : 'Start Assessment'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary px-2 flex items-center gap-3">
          <Award size={24} className="text-secondary" /> Recent Performance
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
          <div className="p-8 space-y-4">
            {attempts.map((att) => (
              <div key={att.id} className="flex-between items-center p-6 bg-bg-soft/30 rounded-3xl border border-border/50 hover:bg-bg-soft transition-all">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-white flex-center shadow-sm text-primary">
                    <Award size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{att.quizTitle}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Score: {att.score}/{att.totalMarks}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">{Math.round((att.score/att.totalMarks)*100)}%</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase">{att.completedAt?.toDate ? att.completedAt.toDate().toLocaleDateString() : 'Recent'}</p>
                </div>
              </div>
            ))}
            {attempts.length === 0 && (
              <div className="py-20 text-center opacity-30 italic">No assessment history found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Quiz Interface */}
      <AnimatePresence>
        {activeQuiz && (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col">
            {/* Quiz Top Bar */}
            <div className="h-20 px-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
              <div className="flex items-center gap-6">
                <div className="bg-primary text-white p-2 rounded-lg">
                   <Timer size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm leading-tight">{activeQuiz.title}</h4>
                  <p className="text-[10px] text-text-muted font-bold uppercase">{activeQuiz.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className={`px-6 py-2 rounded-full font-black text-xl font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                  {formatTime(timeLeft)}
                </div>
                <button 
                   onClick={() => window.confirm('Exit quiz? Progress will be lost.') && setActiveQuiz(null)}
                   className="p-2.5 rounded-full hover:bg-red-50 text-red-500 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-10">
              <div className="w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
                  <h2 className="text-3xl font-bold text-primary leading-tight">
                    {activeQuiz.questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {activeQuiz.questions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`group flex items-center gap-6 p-6 rounded-3xl border-2 text-left transition-all ${
                        answers[currentQuestion] === i 
                          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' 
                          : 'border-border/50 hover:border-primary/30 bg-white'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex-center font-bold text-xs border-2 transition-all ${
                        answers[currentQuestion] === i ? 'bg-primary border-primary text-white' : 'border-border text-text-muted group-hover:border-primary/30'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-bold transition-all ${answers[currentQuestion] === i ? 'text-primary' : 'text-text-muted'}`}>
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quiz Navigation Bar */}
            <div className="h-24 px-8 border-t border-border/50 flex-between items-center bg-bg-soft/30">
              <button 
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="btn py-3 px-8 rounded-2xl flex items-center gap-3 font-bold text-sm text-primary hover:bg-bg-soft disabled:opacity-30"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              
              <div className="flex gap-2">
                {activeQuiz.questions.map((_, i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${
                    i === currentQuestion ? 'bg-primary' : answers[i] !== undefined ? 'bg-green-500/50' : 'bg-border/50'
                  }`}></div>
                ))}
              </div>

              {currentQuestion === activeQuiz.questions.length - 1 ? (
                <button 
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="btn btn-primary py-3 px-10 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit Quiz'}
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQuestion(prev => Math.min(activeQuiz.questions.length - 1, prev + 1))}
                  className="btn btn-primary py-3 px-10 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl shadow-primary/20"
                >
                  Next <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentQuizzes;
