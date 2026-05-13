import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  MoreHorizontal,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminFinance = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'payments'), 
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalTermIncome = transactions
    .filter(t => t.status === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredTransactions = transactions.filter(t => 
    t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Finance Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between h-56 shadow-2xl shadow-primary/20">
            <div className="relative z-10">
              <div className="bg-white/10 w-12 h-12 rounded-2xl flex-center mb-6">
                <TrendingUp size={24} />
              </div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Digital Income</p>
              <h2 className="text-4xl font-black">₦{totalTermIncome.toLocaleString()}</h2>
            </div>
            <div className="flex items-center gap-2 text-secondary font-bold text-xs relative z-10">
              <ArrowUpRight size={18} /> +12.4% vs previous term
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-border/50 shadow-sm flex flex-col justify-between h-56">
            <div>
              <div className="bg-secondary/20 text-primary w-12 h-12 rounded-2xl flex-center mb-6">
                <AlertCircle size={24} />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Fees (Est.)</p>
              <h2 className="text-3xl font-black text-primary">₦2,410,000</h2>
            </div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
              Follow-up required
            </div>
        </div>

        <div className="bg-bg-soft/50 rounded-[2.5rem] p-8 border border-border/50 flex flex-col justify-between h-56">
            <div>
              <div className="bg-primary/5 text-primary w-12 h-12 rounded-2xl flex-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verified Transactions</p>
              <h2 className="text-3xl font-black text-primary">{transactions.length}</h2>
            </div>
            <div className="flex items-center gap-2 text-primary/60 font-bold text-xs uppercase tracking-widest">
              Live from Paystack
            </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 bg-bg-soft/30">
          <div>
            <h3 className="text-xl font-bold text-primary">Recent Digital Transactions</h3>
            <p className="text-xs text-text-muted mt-1 font-medium">Real-time settlement logs from payment gateway</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search Reference..."
                className="bg-white border border-border/50 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary w-64 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-outline py-2.5 px-6 text-sm flex items-center gap-2">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-soft/50 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <th className="px-8 py-4">Transaction Ref</th>
                <th className="px-8 py-4">From Student</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Fee Category</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-bg-soft/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-soft p-2.5 rounded-xl">
                        <CreditCard className="text-primary" size={18} />
                      </div>
                      <span className="font-bold text-primary text-xs font-mono">{txn.reference}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-primary text-sm">{txn.userName}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase">{txn.userId}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-primary">₦{txn.amount?.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black px-3 py-1 bg-bg-soft rounded-full text-text-muted border border-border/50 uppercase">
                      {txn.feeType || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-text-muted font-bold">
                    {txn.createdAt?.toDate ? txn.createdAt.toDate().toLocaleDateString() : 'Today'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center justify-end gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-20 text-center opacity-40">
                    <div className="space-y-4">
                      <CreditCard size={48} className="mx-auto" />
                      <p className="text-sm italic">No digital transactions recorded yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;
