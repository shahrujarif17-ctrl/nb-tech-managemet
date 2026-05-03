import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, User, Shield, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const Login: React.FC = () => {
  const { login } = useAppContext();
  const [role, setRole] = useState<'admin' | 'employee'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const { success, error: loginError } = await login(email, password);
      if (!success) {
        setError(loginError || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0EA5E9]/5 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-[440px] px-6 animate-[fade-in-up_0.6s_ease-out]">
        <div className="bg-[#07111F] rounded-[32px] shadow-2xl border border-[#1E2F46] overflow-hidden">
          
          <div className="p-10 text-center border-b border-[#1E2F46] bg-[#0B1628]/30">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <img src="/logo.png" alt="NB Tech Logo" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <h1 className="text-[28px] font-heading font-extrabold text-[#F8FAFC] tracking-tight">Access NB Tech</h1>
            <p className="text-[#94A3B8] mt-2 text-[15px]">Task Management Suite</p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setRole('admin'); setError(''); }}
                  className={clsx(
                    "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-300",
                    role === 'admin' 
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#F8FAFC] shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                      : "border-[#1E2F46] bg-[#030B1A] text-[#64748B] hover:border-[#94A3B8] hover:text-[#CBD5E1]"
                  )}
                >
                  <Shield className={clsx("w-6 h-6 mb-2", role === 'admin' ? "text-[#2563EB]" : "text-[#64748B]")} />
                  <span className="font-heading font-bold text-sm">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('employee'); setError(''); }}
                  className={clsx(
                    "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-300",
                    role === 'employee' 
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#F8FAFC] shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                      : "border-[#1E2F46] bg-[#030B1A] text-[#64748B] hover:border-[#94A3B8] hover:text-[#CBD5E1]"
                  )}
                >
                  <Briefcase className={clsx("w-6 h-6 mb-2", role === 'employee' ? "text-[#2563EB]" : "text-[#64748B]")} />
                  <span className="font-heading font-bold text-sm">Employee</span>
                </button>
              </div>

              {error && (
                <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-[13px] font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-heading font-bold text-[#CBD5E1] mb-2 px-1">Email Address</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-heading font-bold text-[#CBD5E1] mb-2 px-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#2563EB] transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#030B1A] border border-[#1E2F46] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#3B82F6] disabled:bg-[#2563EB]/50 text-white rounded-xl font-heading font-extrabold text-[15px] flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_25px_rgba(37,99,235,0.3)]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 text-center space-y-2">
          <p className="text-[#64748B] text-[13px] font-medium tracking-wide">
            © {new Date().getFullYear()} NB TECH INFRASTRUCTURE
          </p>
          <div className="flex justify-center gap-4 text-[12px] font-bold text-[#1E2F46]">
            <span>v2.4.0-SECURE</span>
            <span>•</span>
            <span>ENCRYPTED END-TO-END</span>
          </div>
        </div>
      </div>
    </div>
  );
};
