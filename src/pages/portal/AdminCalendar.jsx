import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Cake, 
  X,
  Loader2,
  CalendarDays,
  Bell
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  getDocs 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Event', date: '' });

  // Get calendar days for the current month view
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  useEffect(() => {
    // 1. Fetch Events from Firestore
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // 2. Fetch Birthdays (Students & Staff)
    const fetchBirthdays = async () => {
      const q = query(collection(db, 'users'), where('role', 'in', ['student', 'teacher', 'admin']));
      const snap = await getDocs(q);
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter birthdays for the current month
      const currentMonth = currentDate.getMonth() + 1; // 1-indexed
      const monthBirthdays = allUsers.filter(u => {
        if (!u.birthDate) return false;
        const bDate = new Date(u.birthDate);
        return (bDate.getMonth() + 1) === currentMonth;
      }).map(u => ({
        id: u.id,
        name: u.fullName || u.name,
        role: u.role,
        day: new Date(u.birthDate).getDate(),
        date: u.birthDate
      }));

      setBirthdays(monthBirthdays);
    };

    fetchBirthdays();
    return () => unsubscribe();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewEvent({ title: '', category: 'Event', date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const dayBirthdays = birthdays.filter(b => b.day === day);
    return { events: dayEvents, birthdays: dayBirthdays };
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    // Empty cells for previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Actual days
    for (let i = 1; i <= totalDays; i++) {
      const { events: dayEvs, birthdays: dayBirths } = getEventsForDay(i);
      const hasSomething = dayEvs.length > 0 || dayBirths.length > 0;

      days.push(
        <div 
          key={i} 
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
          className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all cursor-pointer relative group ${
            isToday(i) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 
            isSelected(i) ? 'bg-secondary text-primary' : 'bg-bg-soft/50 text-text-muted hover:bg-bg-soft'
          }`}
        >
          {i}
          {hasSomething && !isToday(i) && !isSelected(i) && (
            <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${dayBirths.length > 0 ? 'bg-pink-400' : 'bg-primary'}`}></div>
          )}
          {dayBirths.length > 0 && (
            <Cake size={10} className="absolute top-2 right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Calendar Header & Navigator */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
               Institutional Academic Planner <Bell size={12} className="text-secondary" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-bg-soft p-1.5 rounded-2xl">
            <button 
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-4 text-[10px] font-black uppercase tracking-widest text-primary"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none btn btn-primary py-3.5 px-6 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-primary/20"
          >
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar Grid View */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border/50 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-7 gap-4 mb-8">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-text-muted tracking-widest opacity-50">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {renderDays()}
          </div>

          {/* Birthday Alert Bar */}
          {birthdays.length > 0 && (
            <div className="mt-12 bg-pink-50 border border-pink-100 p-6 rounded-3xl flex items-center gap-6 animate-pulse">
              <div className="h-12 w-12 bg-white rounded-2xl flex-center text-pink-500 shadow-sm">
                <Cake size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-pink-700">Birthday Celebrations!</h4>
                <p className="text-xs text-pink-600/80">There are {birthdays.length} birthdays this month. Don't forget to prepare special greetings!</p>
              </div>
              <div className="flex -space-x-3">
                {birthdays.slice(0, 3).map((b, i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-pink-200 flex-center text-[10px] font-bold text-pink-600 uppercase">
                    {b.name.charAt(0)}
                  </div>
                ))}
                {birthdays.length > 3 && (
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-white flex-center text-[10px] font-bold text-pink-600">
                    +{birthdays.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Day / Upcoming Events */}
        <div className="space-y-8">
          <div className="bg-bg-soft/50 p-8 rounded-[2.5rem] border border-border/50">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <CalendarDays size={20} className="text-secondary" /> 
              {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="space-y-4">
              {getEventsForDay(selectedDate.getDate()).events.map((ev, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                  <h4 className="font-bold text-primary text-sm mb-2">{ev.title}</h4>
                  <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase">
                    {ev.category}
                  </span>
                </div>
              ))}
              
              {getEventsForDay(selectedDate.getDate()).birthdays.map((b, i) => (
                <div key={i} className="bg-pink-500 p-6 rounded-3xl shadow-lg shadow-pink-200 relative overflow-hidden text-white">
                  <Cake className="absolute -right-4 -bottom-4 text-white/10" size={80} />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Birthday Alert</p>
                  <h4 className="font-bold text-lg leading-tight mb-2">{b.name}</h4>
                  <span className="text-[10px] font-black px-3 py-1 bg-white/20 rounded-full uppercase">
                    {b.role}
                  </span>
                </div>
              ))}

              {getEventsForDay(selectedDate.getDate()).events.length === 0 && 
               getEventsForDay(selectedDate.getDate()).birthdays.length === 0 && (
                <div className="py-10 text-center opacity-40">
                  <p className="text-sm italic">No events scheduled for this date.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-6">Legend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-xs font-medium text-text-muted">School Events</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-pink-400"></div>
                <span className="text-xs font-medium text-text-muted">Birthdays</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                <span className="text-xs font-medium text-text-muted">Holidays</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
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
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border/50 flex-between items-center bg-bg-soft/30">
                <h3 className="text-xl font-bold text-primary">Add New Event</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-border/30 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-10 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Event Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mid-Term Break"
                    className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 px-2">Category</label>
                    <select 
                      className="w-full bg-bg-soft border border-border/50 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium appearance-none"
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                    >
                      <option>Event</option>
                      <option>Holiday</option>
                      <option>Academic</option>
                      <option>Sports</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full btn btn-primary py-4 rounded-2xl shadow-xl shadow-primary/20 mt-4"
                >
                  Confirm Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCalendar;
