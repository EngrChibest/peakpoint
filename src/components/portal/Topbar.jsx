import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

const Topbar = ({ title, user }) => {
  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="text-xs text-text-muted font-medium">Welcome back, {user.name}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-bg-soft border border-border/50 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-bg-soft text-text-muted hover:text-primary transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-10 w-px bg-border mx-2"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary leading-none">{user.name}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">{user.id}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex-center font-bold shadow-lg shadow-primary/20">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
