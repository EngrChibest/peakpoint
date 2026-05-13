import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  ClipboardList, 
  ArrowRight, 
  Loader2,
  User as UserIcon
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ParentDashboard = ({ user, onSelectChild }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChildren() {
      try {
        // Query users where parentEmail or parentId matches this parent
        // For simplicity, we'll search by a field we likely have: parentEmail or a specific parentId
        const q = query(
          collection(db, 'users'), 
          where('role', '==', 'student'),
          where('parentEmail', '==', user.email || '') 
        );
        const snap = await getDocs(q);
        setChildren(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChildren();
  }, [user]);

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}</h2>
          <p className="opacity-80">You have {children.length} {children.length === 1 ? 'child' : 'children'} currently enrolled at Peak Point.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children.map((child) => (
          <div key={child.id} className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="h-16 w-16 rounded-2xl bg-bg-soft text-primary flex-center text-xl font-bold shadow-inner">
                  {child.fullName.charAt(0)}
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Enrolled
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-1">{child.fullName}</h3>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{child.classId || 'Unassigned'}</p>
                <p className="text-[10px] text-text-muted font-medium mt-1">Portal ID: {child.portalId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/30 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                    <GraduationCap size={12} className="text-secondary" /> Attendance
                  </div>
                  <p className="font-bold text-primary">94%</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                    <CreditCard size={12} className="text-secondary" /> Fee Status
                  </div>
                  <p className="font-bold text-green-500">Paid</p>
                </div>
              </div>

              <button 
                onClick={() => onSelectChild(child)}
                className="w-full btn btn-primary py-4 rounded-2xl flex-center gap-2 group-hover:bg-secondary group-hover:text-primary transition-all shadow-lg shadow-primary/10"
              >
                Monitor Progress <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {children.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 p-20 bg-white rounded-[2.5rem] text-center border border-dashed border-border opacity-50">
            <UserIcon size={48} className="mx-auto mb-4" />
            <p className="font-medium">No children linked to this account.</p>
            <p className="text-xs text-text-muted mt-2">Please contact the admin office to link your children's profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
