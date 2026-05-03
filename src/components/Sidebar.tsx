import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'text-blue-500' },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare, color: 'text-emerald-500' },
  { name: 'Employees', path: '/employees', icon: Users, color: 'text-amber-500' },
  { name: 'Settings', path: '/settings', icon: Settings, color: 'text-purple-500' },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAppContext();

  return (
    <aside className="w-64 bg-[#010409] text-[#CBD5E1] border-r border-[#1E2F46] h-screen flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-[#1E2F46] bg-[#010409]">
        <div className="flex items-center gap-3 text-[#F8FAFC] font-heading font-extrabold text-xl tracking-tight">
          <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <img src="/logo.png" alt="NB Tech Logo" className="w-7 h-7 object-contain" />
          </div>
          <span>NB Tech</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-heading font-semibold transition-all duration-200 group',
                isActive
                  ? 'bg-[#2563EB] text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] border border-[#2563EB]'
                  : 'text-[#94A3B8] hover:bg-[#10233D] hover:text-[#F8FAFC] hover:translate-x-1 border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx('w-5 h-5 transition-colors', isActive ? 'text-white' : `group-hover:${item.color}`)} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#1E2F46] space-y-4">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] rounded-xl text-[15px] font-heading font-semibold transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Sign Out
        </button>

        <div className="bg-gradient-to-br from-[#0B1628] to-[#07111F] border border-[#263B57] rounded-[18px] p-5">
          <h4 className="font-heading font-bold text-[#F8FAFC] text-sm mb-2">Upgrade to Pro</h4>
          <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">Unlock advanced reporting and priority support.</p>
          <button className="w-full bg-[#2563EB] text-white text-xs font-bold py-2.5 rounded-lg hover:bg-[#3B82F6] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_10px_rgba(37,99,235,0.2)]">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};
