import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, User, Flag, Loader2 } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { useAppContext } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const { users, addTask, updateTask } = useAppContext();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    client: '',
    assignedTo: '',
    completionPercentage: 0,
    dueDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        client: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        completionPercentage: 0,
        dueDate: new Date().toISOString(),
      });
    }
  }, [task, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (task) {
        const success = await updateTask(task.id, formData);
        if (!success) throw new Error('Failed to update task');
      } else {
        const result = await addTask({
          ...formData,
          startDate: new Date().toISOString(),
        } as any);
        if (!result.success) throw new Error(result.error || 'Failed to create task');
        
        // Final Status Alert
        alert(`Task Created!\nEmail Notification: ${result.emailStatus}`);
      }
      onClose();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-[#020617]/80 backdrop-blur-md p-4 animate-[fade-in-up_0.3s_ease-out]">
      <div className="relative w-full max-w-2xl bg-[#07111F] border border-[#1E2F46] rounded-[24px] shadow-2xl shadow-blue-500/10 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1E2F46] bg-[#0B1628]/30">
          <h3 className="text-[20px] font-heading font-extrabold text-[#F8FAFC]">
            {task ? 'Edit Task Specification' : 'Initialize New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#10233D] p-2 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                placeholder="E.g., Architecture Design Phase"
              />
            </div>

            <div>
              <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Scope Details</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                placeholder="Specify task objectives and deliverables..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Client / Partner</label>
                <div className="relative group">
                  <input
                    type="text"
                    list="client-list"
                    value={formData.client || ''}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                    placeholder="Search or add client"
                  />
                  <datalist id="client-list">
                    <option value="BloomBangla" />
                    <option value="Abloom" />
                    <option value="Roy Agro" />
                    <option value="Magura Group" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Lead Assignee</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <select
                    value={formData.assignedTo}
                    onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] appearance-none transition-all"
                  >
                    <option value="" className="bg-[#07111F]">Select Team Member</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id} className="bg-[#07111F]">{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Submission Deadline</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="date"
                    required
                    value={formData.dueDate ? format(parseISO(formData.dueDate), 'yyyy-MM-dd') : ''}
                    onChange={e => setFormData({ ...formData, dueDate: new Date(e.target.value).toISOString() })}
                    className="w-full pl-11 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full px-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[14px] font-bold text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] appearance-none transition-all capitalize"
                  >
                    <option value="todo" className="bg-[#07111F]">To Do</option>
                    <option value="in-progress" className="bg-[#07111F]">In Progress</option>
                    <option value="review" className="bg-[#07111F]">Review</option>
                    <option value="done" className="bg-[#07111F]">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[14px] font-bold text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] appearance-none transition-all capitalize"
                  >
                    <option value="low" className="bg-[#07111F]">Low</option>
                    <option value="medium" className="bg-[#07111F]">Medium</option>
                    <option value="high" className="bg-[#07111F]">High</option>
                    <option value="critical" className="bg-[#07111F]">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[14px] font-heading font-bold text-[#CBD5E1]">Execution Progress</label>
                <span className="text-[14px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-lg">{formData.completionPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.completionPercentage}
                onChange={e => setFormData({ ...formData, completionPercentage: parseInt(e.target.value) })}
                className="w-full h-2.5 bg-[#020617] rounded-full appearance-none cursor-pointer accent-[#2563EB] border border-[#1E2F46]"
              />
            </div>
            
            {task && task.problemReports && task.problemReports.length > 0 && (
              <div className="bg-[#F97316]/5 border border-[#F97316]/20 rounded-2xl p-5">
                <h4 className="text-[#F97316] font-heading font-bold text-[14px] mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Active Problem Reports
                </h4>
                <div className="space-y-3">
                  {task.problemReports.map(pr => (
                    <div key={pr.id} className="text-[13px] text-[#CBD5E1] bg-[#030B1A] p-3 rounded-xl border border-[#263B57]/30">
                      <span className="font-bold text-[#F8FAFC]">{users.find(u => u.id === pr.userId)?.name}:</span> {pr.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-end gap-4 border-t border-[#1E2F46] pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[14px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#10233D] border border-[#1E2F46] rounded-xl transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-[14px] font-bold text-white bg-[#2563EB] hover:bg-[#3B82F6] disabled:bg-[#2563EB]/50 rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                task ? 'Update Execution' : 'Deploy Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
