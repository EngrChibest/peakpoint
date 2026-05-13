import React from 'react';
import logo from '../../assets/logo.png';

const PrintableReportCard = ({ student, results, term = "First Term", session = "2023/2024" }) => {
  const totalScore = results.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const average = results.length > 0 ? (totalScore / results.length).toFixed(2) : 0;

  return (
    <div id="report-card-print" className="hidden print:block bg-white p-12 text-primary font-serif min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-primary pb-8 mb-8">
        <div className="flex items-center gap-6">
          <img src={logo} alt="Logo" className="h-24 w-24" />
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Peak Point</h1>
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-secondary">International Schools</p>
            <p className="text-[10px] mt-2 font-medium max-w-xs">
              Character formation, discipline, leadership, and moral values.
            </p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase underline">Academic Report Card</h2>
          <p className="font-bold">{term.toUpperCase()} - {session}</p>
        </div>
      </div>

      {/* Student Info Grid */}
      <div className="grid grid-cols-3 gap-8 mb-10 bg-bg-soft/20 p-6 border border-primary/20 rounded-2xl">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Student Name</p>
          <p className="font-black text-lg uppercase">{student.fullName}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Class / Grade</p>
          <p className="font-bold text-lg">{student.classId}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Portal ID</p>
          <p className="font-bold text-lg">{student.portalId}</p>
        </div>
      </div>

      {/* Grades Table */}
      <table className="w-full border-collapse mb-10">
        <thead>
          <tr className="bg-primary text-white">
            <th className="border border-primary px-4 py-3 text-left uppercase text-xs">Subject</th>
            <th className="border border-primary px-4 py-3 text-center uppercase text-xs">C.A (40)</th>
            <th className="border border-primary px-4 py-3 text-center uppercase text-xs">Exam (60)</th>
            <th className="border border-primary px-4 py-3 text-center uppercase text-xs">Total (100)</th>
            <th className="border border-primary px-4 py-3 text-center uppercase text-xs">Grade</th>
            <th className="border border-primary px-4 py-3 text-left uppercase text-xs">Comment</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res, i) => (
            <tr key={i} className="odd:bg-bg-soft/30">
              <td className="border border-border/50 px-4 py-3 font-bold text-sm">{res.subject}</td>
              <td className="border border-border/50 px-4 py-3 text-center text-sm font-medium">
                {(Number(res.ca1) || 0) + (Number(res.ca2) || 0) || '-'}
              </td>
              <td className="border border-border/50 px-4 py-3 text-center text-sm font-medium">{res.exam || '-'}</td>
              <td className="border border-border/50 px-4 py-3 text-center text-sm font-black">{res.total || '-'}</td>
              <td className="border border-border/50 px-4 py-3 text-center text-sm font-black">{res.grade || '-'}</td>
              <td className="border border-border/50 px-4 py-3 text-xs italic">{res.comment || 'Good performance.'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="grid grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="bg-bg-soft/20 p-6 border-l-4 border-secondary rounded-r-2xl">
            <h3 className="font-bold text-xs uppercase mb-3 text-secondary tracking-widest">Class Teacher's Remark</h3>
            <p className="text-sm italic leading-relaxed">
              {average >= 70 ? 
                `${student.firstName} is an exceptional learner who demonstrates a high level of discipline and academic rigor. Well done!` : 
                `${student.firstName} is a promising student. With more focus on the core subjects, significantly better results can be achieved.`}
            </p>
          </div>
          <div className="bg-bg-soft/20 p-6 border-l-4 border-primary rounded-r-2xl">
            <h3 className="font-bold text-xs uppercase mb-3 text-primary tracking-widest">Principal's Final Verdict</h3>
            <p className="text-sm font-bold">
              {average >= 50 ? 'PROMOTED TO NEXT TERM' : 'HELD BACK FOR REVIEW'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex-between border-b-2 border-border/50 py-2">
            <span className="text-xs font-bold uppercase">Total Score:</span>
            <span className="font-black">{totalScore} / {results.length * 100}</span>
          </div>
          <div className="flex-between border-b-2 border-border/50 py-2">
            <span className="text-xs font-bold uppercase">Average Percentage:</span>
            <span className="font-black text-xl">{average}%</span>
          </div>
          <div className="flex-between border-b-2 border-border/50 py-2">
            <span className="text-xs font-bold uppercase">GPA (5.0 Scale):</span>
            <span className="font-black text-xl text-primary">
              {(results.reduce((acc, curr) => {
                const gp = { 'A1': 5, 'B2': 4.5, 'B3': 4, 'C4': 3.5, 'C5': 3, 'C6': 2.5, 'D7': 2, 'E8': 1.5, 'F9': 0 };
                return acc + (gp[curr.grade] || 0);
              }, 0) / (results.length || 1)).toFixed(2)}
            </span>
          </div>
          
          <div className="pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest border-b border-border pb-2 mb-3">Grading Legend</h4>
            <div className="grid grid-cols-3 gap-y-1 gap-x-4">
               {['A1: 5.0', 'B2: 4.5', 'B3: 4.0', 'C4: 3.5', 'C5: 3.0', 'C6: 2.5', 'D7: 2.0', 'E8: 1.5', 'F9: 0.0'].map(g => (
                 <div key={g} className="text-[8px] font-bold text-primary">{g}</div>
               ))}
            </div>
          </div>
          
          <div className="pt-10 flex-between gap-12">
            <div className="text-center border-t border-primary/40 pt-4 flex-1">
              <p className="text-[10px] font-bold uppercase mb-8">Class Teacher</p>
              <div className="h-10 w-full bg-slate-50 mb-2 rounded border border-dashed"></div>
              <p className="text-[10px] font-medium">Signature & Date</p>
            </div>
            <div className="text-center border-t border-primary/40 pt-4 flex-1">
              <p className="text-[10px] font-bold uppercase mb-8">Principal</p>
              <div className="h-10 w-full bg-slate-50 mb-2 rounded border border-dashed"></div>
              <p className="text-[10px] font-medium">Official Stamp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-border/50 text-center text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Peak Point International Schools - Excellence and Character
      </div>
    </div>
  );
};

export default PrintableReportCard;
