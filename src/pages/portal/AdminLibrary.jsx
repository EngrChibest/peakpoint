import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Loader2,
  BookOpen,
  User,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLibrary = () => {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    category: 'General', 
    isbn: '', 
    status: 'Available',
    description: ''
  });

  useEffect(() => {
    // Fetch Books
    const booksQ = query(collection(db, 'books'), orderBy('title', 'asc'));
    const unsubBooks = onSnapshot(booksQ, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Reservations
    const resQ = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubRes = onSnapshot(resQ, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubBooks();
      unsubRes();
    };
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'books'), {
        ...newBook,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewBook({ title: '', author: '', category: 'General', isbn: '', status: 'Available', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const updateReservationStatus = async (resId, bookId, newStatus) => {
    try {
      // Update reservation status
      await updateDoc(doc(db, 'reservations', resId), { status: newStatus });
      
      // Update book status accordingly
      let bookStatus = 'Available';
      if (newStatus === 'approved') bookStatus = 'Reserved';
      if (newStatus === 'collected') bookStatus = 'Borrowed';
      
      await updateDoc(doc(db, 'books', bookId), { status: bookStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to remove this book?')) {
      await deleteDoc(doc(db, 'books', id));
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl">
            <Book size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">Library Management</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Catalog & Circulation Control</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Book Catalog List */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-xl font-bold text-primary px-2">Book Catalog ({books.length})</h4>
          <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-bg-soft/50 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <th className="px-8 py-4">Book Info</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-bg-soft/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-10 bg-bg-soft rounded-lg flex-center border border-border/50">
                            <BookOpen size={18} className="text-text-muted" />
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm leading-tight">{book.title}</p>
                            <p className="text-xs text-text-muted mt-1">{book.author} • {book.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                          book.status === 'Available' ? 'bg-green-100 text-green-600' : 
                          book.status === 'Reserved' ? 'bg-secondary/20 text-primary' : 'bg-red-100 text-red-600'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2.5 rounded-xl hover:bg-bg-soft text-text-muted transition-all"><Edit size={16} /></button>
                          <button onClick={() => deleteBook(book.id)} className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reservation Requests */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-primary px-2">Reservation Requests</h4>
          <div className="space-y-4">
            {reservations.length > 0 ? reservations.map((res) => (
              <div key={res.id} className="bg-white p-6 rounded-[2rem] border border-border/50 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  res.status === 'pending' ? 'bg-secondary' : 
                  res.status === 'approved' ? 'bg-green-500' : 'bg-primary'
                }`}></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-bg-soft flex-center">
                      <User size={18} className="text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{res.userName}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase">{res.createdAt?.toDate ? res.createdAt.toDate().toLocaleDateString() : 'Today'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase ${
                    res.status === 'pending' ? 'text-secondary' : 
                    res.status === 'approved' ? 'text-green-500' : 'text-primary'
                  }`}>{res.status}</span>
                </div>
                <p className="text-sm font-medium text-text-muted mb-6 leading-relaxed">
                  Requested reservation for <span className="font-bold text-primary">"{res.bookTitle}"</span>
                </p>
                
                {res.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => updateReservationStatus(res.id, res.bookId, 'approved')}
                      className="flex-center gap-2 py-3 rounded-xl bg-green-500 text-white text-[10px] font-black uppercase shadow-lg shadow-green-500/10 hover:scale-105 transition-all"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => updateReservationStatus(res.id, res.bookId, 'rejected')}
                      className="flex-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase hover:bg-red-100 transition-all"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
                {res.status === 'approved' && (
                  <button 
                    onClick={() => updateReservationStatus(res.id, res.bookId, 'collected')}
                    className="w-full flex-center gap-2 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase shadow-lg shadow-primary/10 hover:scale-105 transition-all"
                  >
                    Mark as Collected
                  </button>
                )}
                {res.status === 'collected' && (
                  <button 
                    onClick={() => updateReservationStatus(res.id, res.bookId, 'returned')}
                    className="w-full flex-center gap-2 py-3 rounded-xl bg-bg-soft text-primary text-[10px] font-black uppercase hover:bg-border/30 transition-all"
                  >
                    Mark as Returned
                  </button>
                )}
              </div>
            )) : (
              <div className="p-12 bg-bg-soft/30 rounded-[2rem] border border-dashed border-border text-center">
                <History className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm italic text-text-muted">No pending requests found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
                <h3 className="text-xl font-bold text-primary">Add New Library Resource</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-border/30 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddBook} className="p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Book Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={newBook.title}
                      onChange={e => setNewBook({...newBook, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Author</label>
                    <input 
                      type="text" 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={newBook.author}
                      onChange={e => setNewBook({...newBook, author: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Category</label>
                    <select 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium appearance-none"
                      value={newBook.category}
                      onChange={e => setNewBook({...newBook, category: e.target.value})}
                    >
                      <option>General</option>
                      <option>Science</option>
                      <option>Mathematics</option>
                      <option>Literature</option>
                      <option>History</option>
                      <option>Technology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">ISBN</label>
                    <input 
                      type="text" 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={newBook.isbn}
                      onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full btn btn-primary py-4 rounded-2xl shadow-xl shadow-primary/20 mt-4"
                >
                  Add to Catalog
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLibrary;
