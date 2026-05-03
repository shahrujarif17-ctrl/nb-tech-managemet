import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Bell, Lock, Globe, Monitor, Save, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { updateUser, loading, currentUser } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    avatar: '',
    emailNotif: true,
    pushNotif: true,
    theme: 'System Default',
    language: 'English (US)'
  });
  
  const [showToast, setShowToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync form data when currentUser is loaded or updated
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || '',
        avatar: currentUser.avatar || ''
      }));
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    
    setIsSyncing(true);
    const success = await updateUser(currentUser.id, {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      avatar: formData.avatar
    });
    
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setIsSyncing(false);
  };

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
          <p className="text-[#94A3B8] font-heading font-bold animate-pulse">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10 relative">
      {showToast && (
        <div className="fixed top-8 right-8 bg-[#22C55E] text-white px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center gap-3 animate-[fade-in-up_0.4s_ease-out] z-[70]">
          <Check className="w-5 h-5" />
          <span className="font-bold tracking-wide">Changes successfully saved</span>
        </div>
      )}
      
      <div>
        <h1 className="text-[32px] sm:text-[36px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">System Settings</h1>
        <p className="text-[16px] text-[#94A3B8] mt-1">Configure your personal profile and application preferences.</p>
      </div>

      <div className="bg-[#07111F] rounded-[24px] border border-[#1E2F46] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-[#1E2F46] bg-[#0B1628]/30">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-6 h-6 text-[#2563EB]" />
            <h2 className="text-[20px] font-heading font-bold text-[#F8FAFC]">Profile Configuration</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <img src={formData.avatar || 'https://via.placeholder.com/150'} alt={formData.name} className="w-28 h-28 rounded-2xl border-4 border-[#030B1A] shadow-2xl group-hover:border-[#2563EB] transition-all duration-300 object-cover" />
                <div className="absolute inset-0 bg-[#020617]/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                   <Monitor className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-[#64748B] font-medium">Preview</p>
            </div>
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Display Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all" />
                </div>
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all" />
                </div>
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Avatar Image URL</label>
                  <input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all" />
                </div>
                <div>
                  <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-2">Department</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-[#1E2F46]">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-[#F97316]" />
            <h2 className="text-[20px] font-heading font-bold text-[#F8FAFC]">Notifications Control</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-between p-5 bg-[#030B1A] border border-[#1E2F46] rounded-2xl hover:border-[#2563EB]/40 transition-all">
              <div>
                <p className="text-[15px] font-bold text-[#F8FAFC]">Email Alerts</p>
                <p className="text-[13px] text-[#94A3B8] mt-1">Daily project digests and critical security updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.emailNotif} onChange={e => setFormData({...formData, emailNotif: e.target.checked})} className="sr-only peer" />
                <div className="w-12 h-6 bg-[#1E2F46] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#94A3B8] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB] peer-checked:after:bg-white"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-5 bg-[#030B1A] border border-[#1E2F46] rounded-2xl hover:border-[#2563EB]/40 transition-all">
              <div>
                <p className="text-[15px] font-bold text-[#F8FAFC]">Desktop Push</p>
                <p className="text-[13px] text-[#94A3B8] mt-1">Instant notifications for task assignments and mentions.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.pushNotif} onChange={e => setFormData({...formData, pushNotif: e.target.checked})} className="sr-only peer" />
                <div className="w-12 h-6 bg-[#1E2F46] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#94A3B8] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB] peer-checked:after:bg-white"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-[#1E2F46]">
          <div className="flex items-center gap-3 mb-8">
            <Monitor className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-[20px] font-heading font-bold text-[#F8FAFC]">Interface Preferences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
            <div>
              <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-3">System Appearance</label>
              <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full px-5 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all">
                <option value="System Default" className="bg-[#07111F]">Adaptive Interface (Default)</option>
                <option value="Light Mode" className="bg-[#07111F]">High Contrast Light</option>
                <option value="Dark Mode" className="bg-[#07111F]">Premium Deep Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-heading font-bold text-[#CBD5E1] mb-3">Localization</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[15px] text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-all">
                  <option value="English (US)" className="bg-[#07111F]">English (United States)</option>
                  <option value="Spanish" className="bg-[#07111F]">Español</option>
                  <option value="French" className="bg-[#07111F]">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#0B1628]/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button className="flex items-center gap-2 text-[#EF4444] hover:text-[#EF4444]/80 text-sm font-bold transition-all hover:translate-x-1">
            <Lock className="w-4 h-4" />
            Request Password Synchronization
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSyncing || !currentUser}
            className="flex items-center gap-2 px-10 py-3.5 bg-[#2563EB] text-white rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:bg-[#3B82F6] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
