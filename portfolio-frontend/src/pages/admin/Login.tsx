import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/lib/api';
import { Button, InputField } from '@/components/admin/AdminUI';
import { Code2, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login({ username: email, password });
      localStorage.setItem('token', response.access_token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/25">
                <Code2 size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles size={20} className="text-accent animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Admin Portal</h1>
          <p className="text-slate-500 font-medium">Sign in to manage your portfolio</p>
        </div>

        <div className="premium-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600">
                <AlertCircle size={20} /><span className="font-semibold text-sm">{error}</span>
              </div>
            )}
            <InputField label="Username" name="email" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin" required icon={<Mail size={18} />} />
            <InputField label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required icon={<Lock size={18} />} />
            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? <><div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">Protected by enterprise-grade security</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm font-semibold text-primary hover:underline">← Back to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
