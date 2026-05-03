import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <header className="h-16 bg-[#020617] border-b border-[#1E2F46] flex items-center justify-between px-6 z-10 sticky top-0 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center flex-1 gap-6">
        <button className="p-2 -ml-2 text-[#94A3B8] hover:bg-[#10233D] hover:text-[#F8FAFC] rounded-xl md:hidden transition-all">
          <Menu className="w-5 h-5" />
        </button>
        <div className="max-w-md w-full relative hidden sm:block group">
          <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#2563EB] transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-[#94A3B8] hover:bg-[#10233D] hover:text-[#F8FAFC] rounded-xl transition-all group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#020617] shadow-[0_0_10px_rgba(239,68,68,0.4)]"></span>
        </button>
        
        <div className="h-6 w-px bg-[#1E2F46]"></div>
        
        <button className="flex items-center gap-3 hover:bg-[#10233D] p-1.5 pr-3 rounded-xl transition-all group">
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-lg border border-[#263B57] group-hover:border-[#2563EB] transition-colors"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#020617] rounded-full"></div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[14px] font-heading font-bold text-[#F8FAFC] leading-none group-hover:text-[#3B82F6] transition-colors">{currentUser?.name}</p>
            <p className="text-[12px] font-medium text-[#94A3B8] mt-1 capitalize tracking-wide">{currentUser?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
};
