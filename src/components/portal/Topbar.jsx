import { Search, Settings, User, Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Topbar = ({ title, user, onMenuClick }) => {
  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-bg-soft rounded-xl text-primary transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-primary truncate max-w-[200px] md:max-w-none">{title}</h2>
          <p className="text-[10px] md:text-xs text-text-muted font-medium">Welcome, {user.name}</p>
        </div>
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
          <NotificationCenter />
          
          <div className="h-10 w-px bg-border mx-2"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary leading-none">{user.name}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">{user.id}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex-center font-bold shadow-lg shadow-primary/20 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
