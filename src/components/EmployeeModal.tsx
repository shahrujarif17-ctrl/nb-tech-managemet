import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Briefcase, Shield, Image as ImageIcon, Phone, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Role } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as Role,
    department: '',
    phone: '',
    avatar: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await addEmployee(formData);
      if (success) {
        onClose();
        setFormData({ name: '', email: '', role: 'employee', department: '', phone: '', avatar: '' });
      } else {
        setError('Failed to register employee. Please check your database permissions.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#07111F] border border-[#1E2F46] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-[#1E2F46] bg-[#0B1628]/50 flex items-center justify-between">
          <h2 className="text-xl font-heading font-extrabold text-[#F8FAFC]">Add New Employee</h2>
          <button onClick={onClose} className="p-2 text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1E2F46] rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all appearance-none cursor-pointer"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Department</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Engineering"
                  className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#CBD5E1] ml-1">Avatar Image URL (Optional)</label>
              <div className="relative group">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-12 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-[#1E2F46] hover:bg-[#263B57] text-[#CBD5E1] rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-3 px-6 bg-[#2563EB] hover:bg-[#3B82F6] text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
