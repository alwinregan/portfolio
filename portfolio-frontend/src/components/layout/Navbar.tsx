import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const { profileName } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.querySelector('#contact');
      if (el) {
        const offset = 80;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      }
    } else {
      navigate('/#contact');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:block fixed top-0 left-0 right-0 z-50 pt-4 px-4"
    >
      <div
        className="container mx-auto transition-all duration-300 rounded-2xl"
        style={scrolled
          ? { background: 'color-mix(in srgb, var(--page-bg) 88%, transparent)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
          : { background: 'color-mix(in srgb, var(--page-bg) 60%, transparent)', backdropFilter: 'blur(12px)', border: '1px solid color-mix(in srgb, var(--card-border) 50%, transparent)' }
        }
      >
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
              <Code2 size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-none">
                {profileName || 'Alwin Regan'}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Full Stack Engineer
              </div>
            </div>
          </Link>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-all text-sm hover:scale-105"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid #7c3aed', color: '#6d28d9' }}>
                <Download size={15} /> Resume
              </a>
            )}
            <a
              href="/#contact"
              onClick={handleContact}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 text-sm"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
