import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task } from '../types';
import { format, parseISO, isPast } from 'date-fns';
import { Plus, Filter, MoreVertical, Search, X, Calendar } from 'lucide-react';
import { TaskModal } from '../components/TaskModal';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';

export const Tasks: React.FC = () => {
  const { tasks, users, loading } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          <p className="text-[#94A3B8] font-heading font-bold animate-pulse">Synchronizing Repository...</p>
        </div>
      </div>
    );
  }
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterParam === 'completed') matchesFilter = task.status === 'done';
    else if (filterParam === 'pending') matchesFilter = task.status !== 'done';
    else if (filterParam === 'overdue') matchesFilter = task.status !== 'done' && isPast(parseISO(task.dueDate));
    else if (filterParam === 'reported') matchesFilter = task.problemReports.some(pr => !pr.resolved);

    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      case 'high': return 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20';
      case 'medium': return 'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20';
      case 'low': return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      default: return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-[#64748B]/10 text-[#CBD5E1]';
      case 'in-progress': return 'bg-[#2563EB]/10 text-[#3B82F6]';
      case 'review': return 'bg-[#8B5CF6]/10 text-[#8B5CF6]';
      case 'done': return 'bg-[#22C55E]/10 text-[#22C55E]';
      default: return 'bg-[#64748B]/10 text-[#CBD5E1]';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">Tasks Repository</h1>
          <p className="text-[16px] text-[#94A3B8] mt-1">Manage, filter and organize your company operations.</p>
        </div>
        <button 
          onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
          className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      <div className="bg-[#07111F] rounded-[18px] border border-[#1E2F46] shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#1E2F46] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0B1628]/30">
          <div className="relative w-full sm:w-80 group">
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#2563EB] transition-colors" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
          </div>
          <button 
            onClick={() => filterParam ? setSearchParams({}) : null}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 border rounded-xl text-sm font-bold transition-all w-full sm:w-auto justify-center hover:scale-[1.02] active:scale-[0.98]",
              filterParam 
                ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#3B82F6]' 
                : 'bg-[#030B1A] border-[#1E2F46] text-[#CBD5E1] hover:border-[#2563EB]'
            )}
          >
            {filterParam ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            {filterParam ? `Filter: ${filterParam}` : 'Advanced Filters'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1628]/50 border-b border-[#1E2F46] text-[14px] uppercase tracking-wider text-[#94A3B8] font-heading font-extrabold">
                <th className="px-8 py-4">Task Information</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Priority</th>
                <th className="px-8 py-4">Assignee</th>
                <th className="px-8 py-4 hidden lg:table-cell">Timeline</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2F46]">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const assignee = users.find(u => u.id === task.assignedTo);
                  return (
                    <tr 
                      key={task.id} 
                      onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                      className="bg-[#081423] hover:bg-[#10233D] transition-all duration-200 group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">{task.title}</span>
                          <span className="text-[13px] text-[#64748B] line-clamp-1 max-w-xs">{task.description}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={clsx(
                          "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border border-transparent",
                          getStatusColor(task.status)
                        )}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={clsx(
                          "inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-widest border",
                          getPriorityColor(task.priority)
                        )}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {assignee ? (
                          <div className="flex items-center gap-3">
                            <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-lg border border-[#263B57] group-hover:border-[#2563EB] transition-colors shadow-lg" />
                            <span className="text-[14px] font-semibold text-[#CBD5E1] group-hover:text-[#F8FAFC] transition-colors whitespace-nowrap">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#64748B]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-8 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-[#CBD5E1]">
                          <Calendar className="w-4 h-4 text-[#64748B]" />
                          <span className="text-[14px] font-medium">{format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[#64748B] hover:text-[#3B82F6] p-2 rounded-xl hover:bg-[#030B1A] transition-all group-hover:scale-110">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-[#0B1628] rounded-full text-[#64748B]">
                        <Search className="w-10 h-10" />
                      </div>
                      <p className="text-[16px] font-heading font-bold text-[#F8FAFC]">No tasks found</p>
                      <p className="text-[14px] text-[#64748B]">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-[#1E2F46] bg-[#0B1628]/30 flex items-center justify-between text-sm">
          <span className="text-[#94A3B8] font-medium">Showing <span className="text-[#F8FAFC] font-bold">{filteredTasks.length}</span> tasks</span>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-[#1E2F46] bg-[#030B1A] text-[#94A3B8] rounded-xl font-bold hover:border-[#2563EB] hover:text-[#3B82F6] disabled:opacity-30 disabled:hover:border-[#1E2F46] disabled:hover:text-[#94A3B8] transition-all" disabled>Previous</button>
            <button className="px-4 py-2 border border-[#1E2F46] bg-[#030B1A] text-[#94A3B8] rounded-xl font-bold hover:border-[#2563EB] hover:text-[#3B82F6] disabled:opacity-30 disabled:hover:border-[#1E2F46] disabled:hover:text-[#94A3B8] transition-all" disabled>Next</button>
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }} 
        task={selectedTask} 
      />
    </div>
  );
};
