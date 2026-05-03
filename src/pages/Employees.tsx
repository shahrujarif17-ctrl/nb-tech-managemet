import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Briefcase, MoreHorizontal, Plus, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { EmployeeModal } from '../components/EmployeeModal';

export const Employees: React.FC = () => {
  const { users, loading } = useAppContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          <p className="text-[#94A3B8] font-heading font-bold animate-pulse">Loading Team Directory...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 pb-10">
      <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">Team Directory</h1>
          <p className="text-[16px] text-[#94A3B8] mt-1">Personnel management and organizational hierarchy.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user, idx) => {
          const accentColors = ['via-[#2563EB]', 'via-[#22C55E]', 'via-[#F97316]', 'via-[#8B5CF6]'];
          const accentColor = accentColors[idx % accentColors.length];
          return (
            <div key={user.id} className={clsx(
              "bg-[#07111F] rounded-[24px] border border-[#1E2F46] p-8 flex flex-col items-center text-center shadow-xl hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative group overflow-hidden hover:-translate-y-2",
              idx % 4 === 0 ? "hover:border-[#2563EB]" : 
              idx % 4 === 1 ? "hover:border-[#22C55E]" :
              idx % 4 === 2 ? "hover:border-[#F97316]" : "hover:border-[#8B5CF6]"
            )}>
              {/* Background Accent */}
              <div className={clsx("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", accentColor)} />
            
            <button className="absolute top-6 right-6 text-[#64748B] hover:text-[#3B82F6] p-2 rounded-xl hover:bg-[#030B1A] transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            <div className="relative mb-6">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl border-4 border-[#030B1A] shadow-2xl group-hover:border-[#2563EB] transition-all duration-500" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#020617] border-2 border-[#1E2F46] rounded-lg flex items-center justify-center shadow-lg">
                <ShieldCheck className={clsx("w-4 h-4", user.role === 'admin' ? "text-[#2563EB]" : "text-[#22C55E]")} />
              </div>
            </div>

            <h3 className="text-[18px] font-heading font-extrabold text-[#F8FAFC] tracking-tight group-hover:text-[#3B82F6] transition-colors">{user.name}</h3>
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-widest mt-1">{user.role}</p>
            
            <div className="w-full mt-8 space-y-4">
              <div className="flex items-center text-[14px] font-medium text-[#CBD5E1] p-3 bg-[#030B1A] border border-[#1E2F46]/50 rounded-xl group-hover:bg-[#10233D] transition-all">
                <Briefcase className="w-4 h-4 mr-3 text-[#2563EB]" />
                {user.department || 'General Operations'}
              </div>
              <div className="flex items-center text-[14px] font-medium text-[#CBD5E1] p-3 bg-[#030B1A] border border-[#1E2F46]/50 rounded-xl group-hover:bg-[#10233D] transition-all">
                <Mail className="w-4 h-4 mr-3 text-[#2563EB]" />
                <a href={`mailto:${user.email}`} className="hover:text-[#3B82F6] truncate transition-colors">{user.email}</a>
              </div>
            </div>

            <div className="w-full mt-8 flex gap-3">
              <button className="flex-1 bg-transparent border border-[#1E2F46] text-[#CBD5E1] py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#10233D] hover:text-[#F8FAFC] transition-all">
                Profile
              </button>
              <button className="flex-1 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#3B82F6] py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all shadow-[0_4px_10px_rgba(37,99,235,0.1)]">
                Connect
              </button>
            </div>
            </div>
          );
        })}
      </div>
      

    </div>
  );
};
