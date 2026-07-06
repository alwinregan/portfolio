import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar({ resumeUrl }: { resumeUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings, profileName, profileEmail, profileGithub, profileLinkedin } = useSettings();
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
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-all text-sm hover:scale-105"
                  style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid #7c3aed', color: '#6d28d9' }}>
                  <Download size={15} /> Resume
                </a>
              )}
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, '/#contact')}
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
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
                    className="block w-full px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-center font-bold rounded-lg transition-all"
                  >
                    Get In Touch
                  </a>
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 font-bold rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(124,58,237,0.08)', border: '2px solid #7c3aed', color: '#6d28d9' }}>
                      <Download size={16} /> Download Resume
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  {(profileGithub || profileLinkedin || profileEmail) && (
                    <div className="flex justify-center gap-3">
                      {profileGithub && (
                        <a href={profileGithub} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-[#7c3aed] hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                          </svg>
                        </a>
                      )}
                      {profileLinkedin && (
                        <a href={profileLinkedin} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-[#7c3aed] hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {profileEmail && (
                        <a href={`mailto:${profileEmail}`}
                          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-[#7c3aed] hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} {profileName || 'Alwin Regan P'}. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
