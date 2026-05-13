import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, BookOpen, Download, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import PrintableReportCard from '../../components/portal/PrintableReportCard';

const StudentGrades = ({ user }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [averageScore, setAverageScore] = useState(0);
  const [gpa, setGpa] = useState('0.00');
  const [totalClassSubjects, setTotalClassSubjects] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      if (!user?.uid) return;
      setLoading(true);
      try {
        // 1. Get results for this student
        const q = query(
          collection(db, 'results'), 
          where('studentId', '==', user.uid)
        );
        const snap = await getDocs(q);
        
        // Filter and normalize in-memory to handle legacy naming variations
        const resultsData = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(res => {
            const term = res.term?.toLowerCase() || '';
            const target = selectedTerm.toLowerCase();
            // Handle variations like '1st Term' vs 'First Term'
            return term === target || 
                   (target.includes('1st') && term.includes('first')) ||
                   (target.includes('first') && term.includes('1st')) ||
                   (target.includes('2nd') && term.includes('second')) ||
                   (target.includes('second') && term.includes('2nd')) ||
                   (target.includes('3rd') && term.includes('third')) ||
                   (target.includes('third') && term.includes('3rd'));
          });
        
        setResults(resultsData);

        // 2. Get total subjects for this class to calculate overall average
        if (user.classId) {
          const subQ = query(collection(db, 'subjects'), where('classId', '==', user.classId));
          const subSnap = await getDocs(subQ);
          const subCount = subSnap.size || 1;
          setTotalClassSubjects(subCount);

          // Calculate Overall Average Score (%)
          const totalAccumulatedMarks = resultsData.reduce((acc, curr) => acc + (curr.total || 0), 0);
          const calculatedAverage = (totalAccumulatedMarks / subCount).toFixed(1);
          setAverageScore(calculatedAverage);

          // Calculate GPA (5.0 Scale)
          const gradePoints = { 'A1': 5, 'B2': 4.5, 'B3': 4, 'C4': 3.5, 'C5': 3, 'C6': 2.5, 'D7': 2, 'E8': 1.5, 'F9': 0 };
          const totalPoints = resultsData.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0), 0);
          setGpa((totalPoints / subCount).toFixed(2));
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user.uid, user.classId, selectedTerm]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Term Selector & Page Title */}
      <div className="flex justify-between items-center gap-4 flex-wrap bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-primary">Academic Transcript</h2>
          <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-1">Institutional record of excellence</p>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="bg-bg-soft border border-border/50 px-6 py-3 rounded-2xl font-black text-primary outline-none focus:border-primary transition-all text-sm"
          >
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
          <button 
            onClick={handleDownload}
            className="btn btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 font-black text-sm"
          >
            <Download size={18} /> Print {selectedTerm} Report
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary/20">
          <div>
            <p className="text-white/60 text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2">Overall Average (%)</p>
            <h2 className="text-5xl font-black text-white">{averageScore}%</h2>
          </div>
          <div className="mt-6 flex items-center gap-2 text-secondary font-bold text-sm bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
            <TrendingUp size={18} /> {selectedTerm} Standing
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        <div className="bg-secondary rounded-[2rem] p-8 text-primary relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div>
            <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">GPA (5.0 Scale)</p>
            <h2 className="text-5xl font-black text-primary">{gpa}</h2>
          </div>
          <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 w-fit px-4 py-2 rounded-full">
            <Award size={18} /> Academic Excellence
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-border/50 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-2">Grading Legend</p>
            <div className="grid grid-cols-3 gap-1">
               {['A1: 5.0', 'B2: 4.5', 'B3: 4.0', 'C4: 3.5', 'C5: 3.0', 'C6: 2.5', 'D7: 2.0', 'E8: 1.5', 'F9: 0.0'].map(grade => (
                 <span key={grade} className="text-[9px] font-black text-primary bg-bg-soft px-2 py-1 rounded-md text-center">{grade}</span>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/50 bg-bg-soft/20">
          <h3 className="text-xl font-bold text-primary">Term Result Slip (Academic Year 2026/2027 • {selectedTerm})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <th className="px-8 py-4">Subject</th>
                <th className="px-8 py-4 text-center">C.A</th>
                <th className="px-8 py-4 text-center">Exam</th>
                <th className="px-8 py-4 text-center">Total</th>
                <th className="px-8 py-4 text-center">Grade</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {results.map((res, i) => (
                <tr key={i} className="hover:bg-bg-soft/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-soft p-2.5 rounded-xl">
                        <BookOpen className="text-primary" size={18} />
                      </div>
                      <span className="font-bold text-primary text-sm">{res.subject}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-text-muted">
                    {(Number(res.ca1) || 0) + (Number(res.ca2) || 0) || '-'}
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-text-muted">{res.exam || '-'}</td>
                  <td className="px-8 py-6 text-center font-bold text-primary text-lg">{res.total || '-'}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-sm font-black p-2 rounded-lg bg-primary/10 text-primary`}>
                      {res.grade || '-'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-32 h-1.5 bg-bg-soft rounded-full overflow-hidden">
                      <div className={`h-full bg-primary opacity-60`} style={{ width: `${res.total}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan="6" className="p-20 text-center text-text-muted italic">No results released yet for this term.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Component (Hidden in UI) */}
      <PrintableReportCard 
        student={{ fullName: user.name, classId: user.classId || 'Not Set', portalId: user.id, firstName: user.name.split(' ')[0] }} 
        results={results} 
      />

      {/* Feedback Section */}
      <div className="bg-secondary/10 rounded-[2.5rem] p-10 border border-secondary/20 flex flex-col md:flex-row gap-10 items-center">
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-secondary/10 shrink-0">
          <Award className="text-secondary" size={60} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary mb-3">Institutional Feedback</h3>
          <p className="text-text-muted leading-relaxed italic text-lg mb-6">
            "Your academic performance reflects our institutional values of excellence and character. Continue to strive for the highest standards in all your academic pursuits."
          </p>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary flex-center text-white font-bold">PJ</div>
            <div>
              <p className="font-bold text-primary text-sm leading-none">Prophetess Juliet Nnabugwu</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">School Proprietress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
