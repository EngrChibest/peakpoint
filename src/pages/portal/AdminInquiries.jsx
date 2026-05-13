import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Mail, 
  Clock,
  Loader2,
  X,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';

const AdminInquiries = () => {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // In-memory sort to avoid requiring index
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setInquiries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteInquiry = async (id) => {
    if (window.confirm("Delete this entry?")) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showToast("Inquiry deleted", "success");
      } catch (err) { showToast(err.message, "error"); }
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: 'read' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex-between items-center gap-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-primary">Inquiries & Visit Requests</h2>
          <p className="text-sm text-text-muted font-medium mt-1">Manage external communications and campus tour bookings.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-border/50 shadow-sm">
           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Unread Entries</p>
           <p className="text-xl font-black text-secondary">{inquiries.filter(i => i.status !== 'read').length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="p-20 flex-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : inquiries.map((inq) => (
            <div 
              key={inq.id} 
              onClick={() => { setSelectedInquiry(inq); if (inq.status !== 'read') markAsRead(inq.id); }}
              className={`bg-white p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl transition-all cursor-pointer relative group overflow-hidden ${
                selectedInquiry?.id === inq.id ? 'ring-2 ring-primary border-transparent' : ''
              }`}
            >
              {inq.status !== 'read' && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-secondary"></div>}
              <div className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex-center shrink-0 transition-colors ${
                    inq.type === 'visit_request' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {inq.type === 'visit_request' ? <Calendar size={24} /> : <Mail size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-lg text-primary ${inq.status !== 'read' ? 'font-black' : ''}`}>
                        {inq.type === 'visit_request' ? 'Campus Visit Request' : inq.subject || 'Website Inquiry'}
                      </h4>
                      {inq.status !== 'read' && <span className="bg-secondary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>}
                    </div>
                    <p className="text-xs text-text-muted font-medium">From: {inq.fullName || inq.name} ({inq.email})</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                   <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'Recent'}</p>
                   {inq.type === 'visit_request' && <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">Tour: {inq.date}</p>}
                </div>
              </div>
            </div>
          ))}
          {!loading && inquiries.length === 0 && (
            <div className="p-20 bg-white rounded-[2.5rem] text-center border border-dashed border-border opacity-50">
              <MessageSquare size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="font-medium italic">No entries found.</p>
            </div>
          )}
        </div>

        {/* Reader Panel */}
        <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm h-fit overflow-hidden sticky top-8">
          {selectedInquiry ? (
            <div className="flex flex-col">
              <div className="p-8 border-b border-border/50 bg-bg-soft/30 flex-between items-center">
                <h3 className="font-black text-primary uppercase tracking-widest text-sm">Entry Details</h3>
                <button onClick={() => deleteInquiry(selectedInquiry.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-8 space-y-8">
                {selectedInquiry.type === 'visit_request' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                      <Calendar className="text-indigo-600" size={24} />
                      <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Preferred Visit Date</p>
                        <p className="text-lg font-black text-indigo-900">{selectedInquiry.date}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-bg-soft rounded-2xl">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">Requester</p>
                        <p className="text-sm font-bold text-primary">{selectedInquiry.fullName}</p>
                      </div>
                      <div className="p-4 bg-bg-soft rounded-2xl">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">Phone</p>
                        <p className="text-sm font-bold text-primary">{selectedInquiry.phone}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Message Content</p>
                    <div className="bg-bg-soft p-6 rounded-2xl">
                      <p className="text-sm leading-relaxed text-primary whitespace-pre-wrap font-medium">{selectedInquiry.message}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-border/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Contact Email</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-black text-secondary hover:underline">{selectedInquiry.email}</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Received On</span>
                    <span className="text-sm font-bold text-primary">
                      {selectedInquiry.createdAt?.toDate ? selectedInquiry.createdAt.toDate().toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                   <button className="btn btn-primary py-4 rounded-2xl flex-center gap-2 text-xs font-black uppercase tracking-widest">
                      <Mail size={16} /> Reply
                   </button>
                   <button className="btn btn-outline py-4 rounded-2xl flex-center gap-2 text-xs font-black uppercase tracking-widest">
                      <Phone size={16} /> Call
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-24 text-center space-y-4 opacity-30">
              <Eye size={64} className="mx-auto text-text-muted" />
              <p className="text-lg font-bold italic">Select an entry to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;
