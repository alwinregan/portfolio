import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#about', label: 'About', show: true },
    { href: '/#skills', label: 'Skills', show: settings?.featureToggles?.showSkills !== false },
    { href: '/projects', label: 'Projects', show: settings?.featureToggles?.showProjects !== false },
    { href: '/#experience', label: 'Experience', show: settings?.featureToggles?.showExperience !== false },
    { href: '/blog', label: 'Journal', show: settings?.featureToggles?.enableBlog !== false },
    { href: '/#contact', label: 'Contact', show: settings?.featureToggles?.showContactForm !== false },
  ].filter(link => link.show);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith('/#')) {
      const id = href.replace('/#', '#');
      if (location.pathname === '/') {
        const element = document.querySelector(id);
        if (element) {
          const offset = 80;
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 pt-4 px-4"
      >
        <div
          className="container mx-auto transition-all duration-300 rounded-2xl"
          style={scrolled
            ? { background: 'color-mix(in srgb, var(--page-bg) 88%, transparent)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
            : { background: 'color-mix(in srgb, var(--page-bg) 60%, transparent)', backdropFilter: 'blur(12px)', border: '1px solid color-mix(in srgb, var(--card-border) 50%, transparent)' }
          }
        >
          <div className="flex items-center justify-between h-16 px-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                  <Code2 size={20} className="text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  Alwin Regan
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Full Stack Engineer
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-semibold text-muted hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 hover:border-primary text-muted hover:text-primary font-bold rounded-lg transition-all text-sm"
                  style={{ background: 'var(--ghost-bg)', border: '1px solid var(--ghost-border)' }}>
                  <Download size={15} /> Resume
                </a>
              )}
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
              >
                Let's Talk
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:border-primary transition-all"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', backdropFilter: 'blur(8px)' }}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                ) : (
                  <Menu size={20} className="text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 shadow-2xl z-50 lg:hidden overflow-y-auto"
              style={{ background: 'var(--page-bg)', borderLeft: '1px solid var(--card-border)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Code2 size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">Alwin Regan</div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                  >
                    <X size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                <nav className="space-y-2 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block px-4 py-3 text-base font-semibold text-muted hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="flex flex-col gap-3">
                  <a
                    href="/#contact"
                    onClick={(e) => handleNavClick(e, '/#contact')}
                    className="block w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white text-center font-bold rounded-lg transition-all shadow-lg shadow-primary/25"
                  >
                    Get In Touch
                  </a>
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 font-bold rounded-lg transition-all hover:border-primary"
                      style={{ background: 'var(--ghost-bg)', border: '2px solid var(--ghost-border)' }}>
                      <Download size={16} /> Download Resume
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 text-center">© {new Date().getFullYear()} Alwin Regan P. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
