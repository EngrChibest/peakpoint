import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  GraduationCap, 
  CreditCard, 
  ClipboardList, 
  BookOpen, 
  Calendar,
  Clock,
  Loader2,
  Download
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import PrintableReportCard from '../../components/portal/PrintableReportCard';

const ParentChildDetails = ({ child, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    async function fetchChildData() {
      setLoading(true);
      try {
        // Fetch Results
        const resultsQ = query(collection(db, 'results'), where('studentId', '==', child.id));
        const resultsSnap = await getDocs(resultsQ);
        setResults(resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Timetable
        if (child.classId) {
          const timetableQ = query(collection(db, 'timetable'), where('classId', '==', child.classId));
          const timetableSnap = await getDocs(timetableQ);
          setTimetable(timetableSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChildData();
  }, [child]);

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

  const gpa = results.length > 0 
    ? (results.reduce((acc, curr) => acc + (curr.total || 0), 0) / results.length / 25).toFixed(2) 
    : "0.00";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Back to Children List
        </button>
        <button 
          onClick={handleDownload}
          className="btn btn-primary py-3 px-6 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Download size={16} /> Download Report
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-primary text-white flex-center text-3xl font-bold shadow-lg shadow-primary/20">
            {child.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{child.fullName}</h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{child.classId}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 py-2 bg-bg-soft rounded-2xl">
            <p className="text-[10px] font-bold text-text-muted uppercase">Attendance</p>
            <p className="text-lg font-bold text-primary">94%</p>
          </div>
          <div className="text-center px-6 py-2 bg-bg-soft rounded-2xl">
            <p className="text-[10px] font-bold text-text-muted uppercase">GPA</p>
            <p className="text-lg font-bold text-secondary">{gpa}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Results Section */}
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50 flex-between items-center">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <GraduationCap size={24} className="text-secondary" /> Academic Performance
            </h3>
          </div>
          <div className="p-8 space-y-4">
            {results.length > 0 ? results.map((res, i) => (
              <div key={i} className="flex-between items-center p-4 bg-bg-soft/50 rounded-2xl hover:bg-bg-soft transition-all">
                <div>
                  <p className="font-bold text-primary">{res.subject}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase">Term 1 Assessment</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">{res.total}%</p>
                  <p className={`text-[10px] font-black ${res.total >= 50 ? 'text-green-500' : 'text-red-500'}`}>GRADE: {res.grade}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center opacity-50">
                <p className="text-sm italic">No academic records found for this term.</p>
              </div>
            )}
          </div>
        </div>

        {/* Timetable Section */}
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50 flex-between items-center">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <Calendar size={24} className="text-secondary" /> Daily Schedule
            </h3>
          </div>
          <div className="p-8 space-y-4">
            {timetable.length > 0 ? timetable.slice(0, 5).map((item, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 text-center">
                  <p className="text-[10px] font-bold text-text-muted uppercase">{item.time}</p>
                </div>
                <div className="flex-1 p-4 bg-bg-soft/50 rounded-2xl border-l-4 border-secondary">
                  <p className="text-sm font-bold text-primary">{item.subject}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] text-text-muted flex items-center gap-1"><Clock size={10} /> 40 mins</span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1"><BookOpen size={10} /> {item.room}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center opacity-50">
                <p className="text-sm italic">Schedule not available for this class.</p>
              </div>
            )}
          </div>
        </div>

        {/* Fee Status Card */}
        <div className="lg:col-span-2 bg-secondary/10 border border-secondary/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-white text-primary flex-center shadow-sm">
              <CreditCard size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-primary">Financial Status (Term 1)</h4>
              <p className="text-sm text-text-muted">Tuition and mandatory fees have been cleared for this session.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-text-muted uppercase">Status</p>
              <p className="text-xl font-black text-green-500">FULLY PAID</p>
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Printable Component (Hidden in UI) */}
      <PrintableReportCard 
        student={{ fullName: child.fullName, classId: child.classId || 'Not Set', portalId: child.id, firstName: child.fullName.split(' ')[0] }} 
        results={results} 
      />
    </div>
  );
};

export default ParentChildDetails;
