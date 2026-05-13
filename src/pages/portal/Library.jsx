import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Filter, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const Library = ({ user }) => {
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reserving, setReserving] = useState(null);

  const categories = ['All', 'Science', 'Mathematics', 'Literature', 'History', 'Technology', 'General'];

  useEffect(() => {
    const q = collection(db, 'books');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleReserve = async (book) => {
    setReserving(book.id);
    try {
      await addDoc(collection(db, 'reservations'), {
        bookId: book.id,
        bookTitle: book.title,
        userId: user.id,
        userName: user.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      showToast(`Reservation request for "${book.title}" sent successfully!`, "success");
    } catch (err) {
      console.error(err);
      showToast('Failed to place reservation. Please try again.', "error");
    } finally {
      setReserving(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-20 flex-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Search & Filter Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full bg-bg-soft border border-border/50 pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-bg-soft text-text-muted hover:bg-border/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <motion.div 
            layout
            key={book.id} 
            className="bg-white rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all"
          >
            {/* Book Cover Placeholder */}
            <div className="aspect-[3/4] bg-bg-soft relative overflow-hidden flex-center">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <BookOpen size={60} className="text-border group-hover:text-primary/20 transition-colors" />
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  book.status === 'Available' ? 'bg-green-500 text-white' : 
                  book.status === 'Reserved' ? 'bg-secondary text-primary' : 'bg-red-500 text-white'
                }`}>
                  {book.status}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">{book.category}</p>
              <h3 className="font-bold text-primary text-lg mb-1 leading-tight line-clamp-2">{book.title}</h3>
              <p className="text-sm text-text-muted font-medium mb-6">by {book.author}</p>
              
              <div className="mt-auto pt-6 border-t border-border/50 flex-between items-center">
                <div className="flex items-center gap-2">
                  <Bookmark size={14} className="text-text-muted" />
                  <span className="text-[10px] font-bold text-text-muted uppercase">ISBN: {book.isbn}</span>
                </div>
                <button 
                  onClick={() => handleReserve(book)}
                  disabled={book.status !== 'Available' || reserving === book.id}
                  className={`btn py-2.5 px-6 rounded-xl text-xs font-bold transition-all ${
                    book.status === 'Available' 
                      ? 'btn-primary shadow-lg shadow-primary/10' 
                      : 'bg-bg-soft text-border cursor-not-allowed'
                  }`}
                >
                  {reserving === book.id ? <Loader2 className="animate-spin" size={16} /> : 'Reserve'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 opacity-40">
            <Book size={64} className="mx-auto" />
            <p className="text-lg font-medium italic">No books found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Reservation Summary (Quick View) */}
      <div className="bg-bg-soft/50 p-10 rounded-[3rem] border border-border/50">
        <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
          <Clock size={24} className="text-secondary" /> Recent Reservations
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-6">
            <div className="bg-green-100 text-green-600 p-4 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase mb-1">Approved</p>
              <p className="text-lg font-black text-primary">02</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-6">
            <div className="bg-secondary/20 text-primary p-4 rounded-2xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase mb-1">Pending</p>
              <p className="text-lg font-black text-primary">01</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-6">
            <div className="bg-red-100 text-red-600 p-4 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase mb-1">Returned</p>
              <p className="text-lg font-black text-primary">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
