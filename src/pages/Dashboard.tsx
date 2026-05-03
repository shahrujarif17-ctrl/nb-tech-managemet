import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskModal } from '../components/TaskModal';
import type { Task } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import { isPast, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, colorClass, hoverClass, trend, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-[#07111F] rounded-[18px] border border-[#1E2F46] p-6 shadow-sm transition-all duration-250 ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${hoverClass}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass} shadow-inner`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && typeof trend === 'string' && (
        <div className={clsx(
          "flex items-center text-xs font-bold px-2.5 py-1 rounded-full",
          trend.startsWith('+') ? "bg-[#22C55E]/20 text-[#4ADE80]" : "bg-[#EF4444]/20 text-[#F87171]"
        )}>
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[15px] font-heading font-semibold text-[#94A3B8] mb-1">{title}</p>
      <h3 className="text-[34px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { tasks, users, loading } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const pending = tasks.filter(t => t.status !== 'done').length;
    const overdue = tasks.filter(t => t.status !== 'done' && isPast(parseISO(t.dueDate))).length;
    const problems = tasks.reduce((acc, t) => acc + (Array.isArray(t.problemReports) ? t.problemReports.filter(pr => !pr.resolved).length : 0), 0);

    return { total, completed, pending, overdue, problems };
  }, [tasks]);

  const recentTasks = [...tasks].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          <p className="text-[#94A3B8] font-heading font-bold animate-pulse">Initializing Data Stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] sm:text-[36px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">Dashboard Overview</h1>
          <p className="text-[16px] text-[#94A3B8] mt-1">Monitor project progress and team performance in real-time.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={FileText}
          colorClass="bg-[#2563EB]/10 text-[#3B82F6]"
          hoverClass="hover:border-[#2563EB] hover:shadow-[0_12px_30px_rgba(37,99,235,0.15)]"
          trend="+12%"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          icon={Clock}
          colorClass="bg-[#F97316]/10 text-[#F97316]"
          hoverClass="hover:border-[#F97316] hover:shadow-[0_12px_30px_rgba(249,115,22,0.15)]"
          onClick={() => navigate('/tasks?filter=pending')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          colorClass="bg-[#22C55E]/10 text-[#22C55E]"
          hoverClass="hover:border-[#22C55E] hover:shadow-[0_12px_30px_rgba(34,197,94,0.15)]"
          trend="+5%"
          onClick={() => navigate('/tasks?filter=completed')}
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdue}
          icon={AlertCircle}
          colorClass="bg-[#EF4444]/10 text-[#EF4444]"
          hoverClass="hover:border-[#EF4444] hover:shadow-[0_12px_30px_rgba(239,68,68,0.15)]"
          onClick={() => navigate('/tasks?filter=overdue')}
        />
        <StatCard
          title="Reported Problems"
          value={stats.problems}
          icon={AlertCircle}
          colorClass="bg-[#8B5CF6]/10 text-[#8B5CF6]"
          hoverClass="hover:border-[#8B5CF6] hover:shadow-[0_12px_30px_rgba(139,92,246,0.15)]"
          onClick={() => navigate('/tasks?filter=reported')}
        />
      </div>

      <div className="bg-[#07111F] rounded-[18px] border border-[#1E2F46] shadow-xl overflow-hidden mt-10">
        <div className="px-8 py-6 border-b border-[#1E2F46] flex justify-between items-center bg-[#0B1628]/30">
          <h2 className="text-[20px] font-heading font-bold text-[#F8FAFC]">Recent Tasks</h2>
          <button onClick={() => navigate('/tasks')} className="text-sm text-[#3B82F6] hover:text-[#0EA5E9] font-bold transition-colors">View all tasks</button>
        </div>
        <div className="divide-y divide-[#1E2F46]">
          {recentTasks.map(task => {
            const assignee = users.find(u => u.id === task.assignedTo);
            return (
              <div 
                key={task.id} 
                onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                className="px-8 py-5 flex items-center justify-between hover:bg-[#10233D] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-semibold text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border',
                      task.status === 'done' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 
                      task.status === 'in-progress' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' :
                      'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20'
                    )}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className="text-[13px] text-[#64748B]">• {task.client || 'Internal Project'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  {assignee ? (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-lg border border-[#263B57] group-hover:border-[#2563EB] transition-colors shadow-lg" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#07111F] rounded-full"></div>
                      </div>
                      <span className="text-[14px] font-medium text-[#CBD5E1] group-hover:text-[#F8FAFC] transition-colors">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-[14px] text-[#64748B]">Unassigned</span>
                  )}
                  <div className="text-right hidden sm:block w-32">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-[#F8FAFC]">{task.completionPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden border border-[#1E2F46]">
                      <div
                        className={clsx(
                          "h-full rounded-full transition-all duration-500",
                          task.status === 'done' ? "bg-gradient-to-r from-[#22C55E] to-[#4ADE80] shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
                          task.status === 'in-progress' ? "bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] shadow-[0_0_8px_rgba(37,99,235,0.4)]" :
                          "bg-gradient-to-r from-[#F97316] to-[#FB923C] shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                        )}
                        style={{ width: `${task.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
