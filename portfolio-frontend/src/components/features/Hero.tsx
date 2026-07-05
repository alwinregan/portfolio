
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
;
import { t } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface HeroProps {
  profile: any;
  projectCount?: number;
  skillCount?: number;
  yearsValue?: string;
}

const TERM_LINES = [
  { type: 'cmd',  text: 'node server.js' },
  { type: 'ok',   text: 'MongoDB connected' },
  { type: 'ok',   text: 'PostgreSQL pool ready' },
  { type: 'ok',   text: 'Redis cache online' },
  { type: 'ok',   text: 'Server running :4000' },
  { type: 'info', text: '10,000+ customers served' },
  { type: 'cursor' },
];

export default function Hero({ profile, projectCount = 0, skillCount = 0, yearsValue = '5+' }: HeroProps) {
  const [activeTitleIdx, setActiveTitleIdx] = useState(0);
  const [termVisible, setTermVisible] = useState(0);
  const titles = profile?.titles || [];

  useEffect(() => {
    if (titles.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTitleIdx((prev) => (prev + 1) % titles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [titles]);

  useEffect(() => {
    const timers = TERM_LINES.map((_, i) =>
      setTimeout(() => setTermVisible(i + 1), 600 + i * 420)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden"
      >
      {/* Subtle dot grid — body::before handles the gradient glow */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            {/* Main Headline */}
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
              >
                {t(profile?.heroPrefix) || "Hi, I'm"}{' '}
                <span className="text-gradient">{profile?.name || "Alwin Regan"}</span>
                <span className="text-slate-400 dark:text-slate-600"></span>
              </motion.h1>

              {/* Animated Role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400 mb-2"
              >
                {titles.length > 0 ? (
                  <span key={activeTitleIdx} className="inline-block animate-fade-in">
                    {t(titles[activeTitleIdx])}
                  </span>
                ) : (
                  t(profile?.role) || "Full Stack Engineer"
                )}
              </motion.div>

              {/* Tagline */}
              {profile?.heroSuffix && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-slate-500 dark:text-slate-500 font-medium"
                >
                  {t(profile.heroSuffix)}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              {t(profile?.summary) || "I engineer scalable web architectures with 6+ years of technical excellence."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="projects"
                className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 flex items-center gap-2"
              >
                View My Work
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Always show resume button — download if URL exists, else scroll to contact */}
              {profile?.resumeUrl ? (
                <a
                  href={profile.resumeUrl.startsWith('/')
                    ? `${(import.meta.env.VITE_API_URL || '/api').replace('/api', '')}${profile.resumeUrl}`
                    : profile.resumeUrl}
                  download
                  className="group px-8 py-4 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ background: 'var(--ghost-bg)', border: '2px solid var(--ghost-border)', backdropFilter: 'blur(16px)' }}
                >
                  <Download size={18} />
                  Download Resume
                </a>
              ) : (
                <a
                  href="#contact"
                  onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="group px-8 py-4 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 opacity-70"
                  style={{ background: 'var(--ghost-bg)', border: '2px solid var(--ghost-border)', backdropFilter: 'blur(16px)' }}
                >
                  <Download size={18} />
                  Resume
                </a>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 pt-6"
              style={{ borderTop: '1px solid var(--card-border)' }}
            >
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{projectCount}+</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Projects</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{yearsValue}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Years Exp</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{skillCount}+</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Technologies</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl blur-3xl" />
              
              {/* Terminal */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: '1px solid rgba(var(--color-primary), 0.25)', boxShadow: '0 0 60px rgba(var(--color-primary), 0.12), 0 25px 50px -12px rgba(0,0,0,0.5)', background: '#0d0d10' }}>
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#161618', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <span className="ml-auto text-[11px] text-slate-600 font-mono tracking-wide">alwin@portfolio ~ node</span>
                  </div>
                  {/* Lines */}
                  <div className="p-5 font-mono text-[13px] leading-relaxed space-y-1.5 min-h-[220px]">
                    {TERM_LINES.map((line, i) => (
                      <div key={i}
                        className="flex items-center gap-2.5 transition-opacity duration-300"
                        style={{ opacity: termVisible > i ? 1 : 0 }}>
                        {line.type === 'cmd'    && <><span className="text-violet-400 select-none">$</span><span className="text-slate-200">{line.text}</span></>}
                        {line.type === 'ok'     && <><span className="text-emerald-400">✓</span><span className="text-slate-300">{line.text}</span></>}
                        {line.type === 'info'   && <><span className="text-amber-400">→</span><span className="text-slate-300">{line.text}</span></>}
                        {line.type === 'cursor' && (
                          <><span className="text-violet-400 select-none">$</span>
                          <span className="inline-block w-2 h-4 bg-violet-400 align-middle animate-pulse rounded-[2px]" /></>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links - Floating */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3"
                >
                  {[
                    { svg: 'github',   href: profile?.socialLinks?.github,   label: 'GitHub' },
                    { svg: 'linkedin', href: profile?.socialLinks?.linkedin,  label: 'LinkedIn' },
                    { svg: 'mail',     href: `mailto:${profile?.email}`,      label: 'Email' },
                  ].map((social, i) => social.href && (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                      className="w-14 h-14 flex items-center justify-center shadow-xl rounded-xl hover:scale-110 hover:border-primary transition-all group"
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', backdropFilter: 'blur(12px)', ['--hover-bg' as any]: 'rgb(var(--color-primary))' }}
                    >
                      {social.svg === 'github' && (
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="group-hover:text-white transition-colors">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                        </svg>
                      )}
                      {social.svg === 'linkedin' && (
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="group-hover:text-white transition-colors">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {social.svg === 'mail' && <Mail size={22} className="group-hover:text-white transition-colors" />}
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator — sits above the bottom fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block z-10"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll to explore</span>
          <div className="w-5 h-9 border-2 border-current rounded-full p-0.5 flex justify-center">
            <div className="w-1 h-2.5 rounded-full animate-bounce" style={{ background: 'rgb(var(--color-primary))' }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
