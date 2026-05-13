import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, CheckCircle2, Save, Download, Loader2, SaveAll } from 'lucide-react';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TeacherGrading = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [scores, setScores] = useState({}); // { studentId: { ca1, ca2, exam } }

  useEffect(() => {
    async function fetchAssignments() {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'assignments'), where('teacherId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssignments(list);
        if (list.length > 0) setSelectedAssignmentId(list[0].id);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchAssignments();
  }, [currentUser]);

  useEffect(() => {
    async function fetchStudentsAndScores() {
      if (!selectedAssignmentId) return;
      const assignment = assignments.find(a => a.id === selectedAssignmentId);
      if (!assignment) return;

      setLoading(true);
      try {
        const q = query(collection(db, 'users'), where('classId', '==', assignment.classId));
        const studentSnap = await getDocs(q);
        setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const scoresQ = query(
          collection(db, 'results'), 
          where('classId', '==', assignment.classId),
          where('subject', '==', assignment.subject)
        );
        const scoresSnap = await getDocs(scoresQ);
        const scoresData = {};
        scoresSnap.docs.forEach(doc => {
          const data = doc.data();
          // Filter by term in-memory for precision
          if (data.term === selectedTerm) {
            scoresData[data.studentId] = data;
          }
        });
        setScores(scoresData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchStudentsAndScores();
  }, [selectedAssignmentId, selectedTerm, assignments]);

  const handleScoreChange = (studentId, field, value) => {
    const assignment = assignments.find(a => a.id === selectedAssignmentId);
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Number(value),
        studentId,
        classId: assignment.classId,
        subject: assignment.subject,
        term: selectedTerm
      }
    }));
  };

  const calculateGrade = (total) => {
    if (total >= 75) return 'A1';
    if (total >= 70) return 'B2';
    if (total >= 65) return 'B3';
    if (total >= 60) return 'C4';
    if (total >= 55) return 'C5';
    if (total >= 50) return 'C6';
    if (total >= 45) return 'D7';
    if (total >= 40) return 'E8';
    return 'F9';
  };

  const handleSaveAll = async () => {
    const assignment = assignments.find(a => a.id === selectedAssignmentId);
    setIsSaving(true);
    try {
      for (const studentId in scores) {
        // ID includes term to prevent overwriting other terms
        const termSlug = selectedTerm.replace(/\s+/g, '-').toLowerCase();
        const resultId = `${studentId}_${assignment.classId}_${assignment.subject.replace(/\s+/g, '-')}_${termSlug}`;
        const data = scores[studentId];
        const total = (data.ca1 || 0) + (data.ca2 || 0) + (data.exam || 0);
        await setDoc(doc(db, 'results', resultId), {
          ...data,
          term: selectedTerm,
          total,
          grade: calculateGrade(total),
          updatedAt: new Date().toISOString()
        });
      }
      showToast(`${selectedTerm} results saved successfully!`, "success");
    } catch (err) { 
      showToast("Error saving results: " + err.message, "error"); 
    } finally {
      setIsSaving(false);
    }
  };

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary text-white p-4 rounded-2xl shadow-lg">
              <GraduationCap size={32} />
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Select Subject</p>
                  <select 
                    value={selectedAssignmentId} 
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="text-lg font-bold text-primary bg-transparent outline-none cursor-pointer border-b-2 border-transparent hover:border-primary/20"
                  >
                    {assignments.map(a => <option key={a.id} value={a.id}>{a.className} - {a.subject}</option>)}
                  </select>
              </div>
              <div className="w-px h-10 bg-border/50 mx-2"></div>
              <div className="space-y-1">
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Target Term</p>
                  <select 
                    value={selectedTerm} 
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="text-lg font-bold text-secondary bg-transparent outline-none cursor-pointer border-b-2 border-transparent hover:border-secondary/20"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveAll} 
              disabled={isSaving || !selectedAssignmentId}
              className="btn btn-primary py-3.5 px-10 text-sm flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70 transition-transform hover:scale-105"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <SaveAll size={18} />} 
              {isSaving ? 'Cloud Syncing...' : 'Publish Results'}
            </button>
          </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4 text-center">CA 1 (20)</th>
                <th className="px-8 py-4 text-center">CA 2 (20)</th>
                <th className="px-8 py-4 text-center">Exam (60)</th>
                <th className="px-8 py-4 text-center">Total</th>
                <th className="px-8 py-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan="6" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
              ) : students.length > 0 ? students.map((std) => {
                const s = scores[std.id] || {};
                const total = (s.ca1 || 0) + (s.ca2 || 0) + (s.exam || 0);
                return (
                  <tr key={std.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-primary text-sm">{std.fullName}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase">{std.portalId}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input type="number" max="20" value={s.ca1 || ''} onChange={(e) => handleScoreChange(std.id, 'ca1', e.target.value)} className="w-16 bg-bg-soft border border-border/50 p-2 rounded-lg text-center font-bold text-primary" />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input type="number" max="20" value={s.ca2 || ''} onChange={(e) => handleScoreChange(std.id, 'ca2', e.target.value)} className="w-16 bg-bg-soft border border-border/50 p-2 rounded-lg text-center font-bold text-primary" />
                    </td>
                    <td className="px-8 py-6 text-center">
                      <input type="number" max="60" value={s.exam || ''} onChange={(e) => handleScoreChange(std.id, 'exam', e.target.value)} className="w-16 bg-bg-soft border border-border/50 p-2 rounded-lg text-center font-bold text-primary" />
                    </td>
                    <td className="px-8 py-6 text-center font-black text-primary">
                      {total}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-black ${total >= 50 ? 'text-green-500' : 'text-red-500'}`}>{calculateGrade(total)}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" className="p-20 text-center text-text-muted italic">No students found in this class.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherGrading;
