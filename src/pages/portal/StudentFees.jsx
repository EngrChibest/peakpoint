import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  History, 
  AlertCircle, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import { initializePayment } from '../../utils/PaystackService';

const StudentFees = ({ user }) => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Default institutional fees (In a real app, these could come from a 'fee_structure' collection)
  const pendingFees = [
    { id: 'FEE-2026-T1', description: 'Term 1 Tuition Fees', amount: 150000, type: 'Tuition' },
    { id: 'FEE-2026-UNI', description: 'Uniform & Accessories', amount: 35000, type: 'Uniform' },
    { id: 'FEE-2026-ICT', description: 'Lab & ICT Materials', amount: 15000, type: 'Materials' },
  ];

  useEffect(() => {
    if (!user?.id) return;
    
    const q = query(
      collection(db, 'payments'), 
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in-memory to avoid index requirement
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      });
      setPayments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePayment = (fee) => {
    setIsProcessing(true);
    initializePayment({
      email: `${user.id.toLowerCase()}@peakpoint.edu`, // Mock email for testing
      amount: fee.amount,
      metadata: {
        userId: user.id,
        userName: user.name,
        feeType: fee.type,
        feeDescription: fee.description
      },
      onSuccess: (response) => {
        setIsProcessing(false);
        showToast(`Payment successful! Reference: ${response.reference}`, "success");
      },
      onCancel: () => {
        setIsProcessing(false);
      }
    });
  };

  const getStatus = (feeType) => {
    const payment = payments.find(p => p.feeType === feeType && p.status === 'success');
    return payment ? 'Paid' : 'Pending';
  };

  const totalPaid = payments
    .filter(p => p.status === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const outstanding = pendingFees
    .filter(f => getStatus(f.type) === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Fee Summary Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-border/50 shadow-sm relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10">
            <div className="bg-red-50 text-red-500 w-12 h-12 rounded-2xl flex-center mb-6 shadow-inner">
              <AlertCircle size={24} />
            </div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Outstanding Balance</p>
            <h2 className="text-4xl font-black text-primary mb-6">₦{outstanding.toLocaleString()}</h2>
            <p className="text-xs text-text-muted mb-8 italic">Please settle pending fees to maintain portal access.</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
        </div>

        <div className="bg-secondary rounded-[2.5rem] p-10 text-primary relative overflow-hidden flex flex-col justify-between shadow-lg shadow-secondary/10">
          <div className="relative z-10">
            <div className="bg-white/50 text-primary w-12 h-12 rounded-2xl flex-center mb-6">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Paid (Session)</p>
            <h2 className="text-4xl font-black mb-6">₦{totalPaid.toLocaleString()}</h2>
            <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Generate Statement
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Fee List */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 flex-between items-center border-b border-border/50 bg-bg-soft/30">
          <h3 className="text-xl font-bold text-primary flex items-center gap-3">
            <Receipt size={24} className="text-secondary" /> Academic Year 2026/2027
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase">
            <ShieldCheck size={16} className="text-green-500" /> Secure Payments Powered by Paystack
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-black text-text-muted uppercase tracking-widest">
                <th className="px-8 py-4">Fee Item</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {pendingFees.map((fee) => {
                const status = getStatus(fee.type);
                return (
                  <tr key={fee.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-bg-soft p-3 rounded-xl">
                          <CreditCard className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{fee.description}</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase">{fee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-primary">₦{fee.amount.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${
                        status === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'
                      }`}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {status === 'Pending' ? (
                        <button 
                          onClick={() => handlePayment(fee)}
                          disabled={isProcessing}
                          className="btn btn-primary py-2.5 px-8 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/10 hover:scale-105 transition-all"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" size={14} /> : 'Pay Now'}
                        </button>
                      ) : (
                        <button className="p-2.5 rounded-xl bg-bg-soft text-text-muted hover:text-primary transition-all">
                          <Download size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      {payments.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-primary px-2 flex items-center gap-3">
             <History size={24} className="text-secondary" /> Recent Transactions
          </h4>
          <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
             <div className="p-8 space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className="flex-between items-center p-6 bg-bg-soft/30 rounded-3xl border border-border/50 hover:bg-bg-soft transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-white flex-center shadow-sm text-green-500">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{p.feeType} Payment</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase">REF: {p.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">₦{p.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase">{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Today'}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Institutional Security Note */}
      <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-white flex-center shadow-sm text-primary">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="font-bold text-primary">Institutional Payment Security</h4>
            <p className="text-xs text-text-muted max-w-lg leading-relaxed">
              Peak Point International Schools utilizes end-to-end encryption for all financial transactions. We do not store sensitive card data on our servers.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Secure" className="h-4 opacity-30 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Secure" className="h-4 opacity-30 grayscale" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Secure" className="h-4 opacity-30 grayscale" />
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
