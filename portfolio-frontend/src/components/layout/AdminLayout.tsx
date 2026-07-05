
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Settings as SettingsIcon,
  LogOut,
  Code2,
  Briefcase,
  Award,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Zap
} from 'lucide-react';
import { getProfile, getAdminContacts } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); const pathname = location.pathname;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    Promise.all([
      getProfile(),
      getAdminContacts()
    ])
      .then(([profileData, contactsData]) => {
        setProfile(profileData);
        if (Array.isArray(contactsData)) {
          const unread = contactsData.filter((c: any) => c.status === 'unread').length;
          setUnreadCount(unread);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Layout Profile Fetch Error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
        setLoading(false);
      });
  }, [navigate, pathname]); // Re-fetch on navigation to update counts

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <Code2 size={32} className="text-white" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
      </div>
    </div>
  );

  const navItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
    { href: '/admin/projects', icon: <FolderOpen size={20} />, label: 'Projects' },
    { href: '/admin/apps', icon: <Zap size={20} />, label: 'Apps' },
    { href: '/admin/experience', icon: <Briefcase size={20} />, label: 'Experience' },
    { href: '/admin/skills', icon: <Code2 size={20} />, label: 'Skills' },
    { href: '/admin/certifications', icon: <Award size={20} />, label: 'Certifications' },
    { href: '/admin/blog', icon: <BookOpen size={20} />, label: 'Journal' },
    { href: '/admin/media', icon: <ImageIcon size={20} />, label: 'Media' },
    { href: '/admin/contacts', icon: <Mail size={20} />, label: 'Messages', badge: unreadCount },
    { href: '/admin/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-800"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              />
            )}

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed lg:sticky top-0 left-0 h-screen w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 z-40 shadow-2xl lg:shadow-none"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Code2 size={24} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles size={12} className="text-accent animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio CMS</div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2 flex-grow overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
                        ${isActive 
                          ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }
                      `}
                    >
                      {item.icon} 
                      <span className="flex-1">{item.label}</span>
                      {/* @ts-ignore */}
                      {item.badge > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full scale-105 shadow-sm shadow-primary/25">
                          {/* @ts-ignore */}
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-semibold transition-all mt-4 border border-transparent hover:border-red-500/20"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-3">
                  <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
                  <ChevronRight size={12} />
                  <span className="text-slate-500">{title}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {title}
                </h1>
                <p className="text-slate-500 font-medium">{subtitle || 'Manage your portfolio content'}</p>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="text-right">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{profile?.name || 'Admin'}</div>
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider">Administrator</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  {profile?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
