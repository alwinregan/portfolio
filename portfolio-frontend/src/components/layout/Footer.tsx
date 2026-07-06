
import { Link } from 'react-router-dom';
import { ArrowUp, Code2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface FooterProps {
  profileName?: string;
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '');

export default function Footer({ profileName }: FooterProps) {
  const { profileName: ctxName, profileEmail, profileGithub, profileLinkedin } = useSettings();
  const name = profileName || ctxName || 'Alwin Regan P';
  const github = profileGithub || 'https://github.com/alwinregan';
  const linkedin = profileLinkedin || 'https://linkedin.com/in/alwinregan';
  const email = profileEmail || 'alwinregancse98@gmail.com';

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(var(--color-primary), 0.5), rgba(var(--color-accent), 0.3), transparent)' }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-accent)))' }}>
                <Code2 size={20} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">{name.toUpperCase()}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted max-w-xs">
              Full-Stack Engineer specializing in scalable web architectures and production-ready fintech solutions.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { href: github, label: 'GitHub', svg: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                  </svg>
                )},
                { href: linkedin, label: 'LinkedIn', svg: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )},
                { href: `mailto:${email}`, label: 'Email', svg: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                )},
              ].map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  title={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:text-white"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgb(var(--color-primary))' }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/#about',      label: 'About' },
                { to: '/projects',    label: 'Projects' },
                { to: '/#skills',     label: 'Skills' },
                { to: '/#experience', label: 'Experience' },
                { to: '/#contact',    label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted hover:text-foreground transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgb(var(--color-accent))' }}>
              Let's Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm font-medium text-muted hover:text-foreground transition-colors group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:text-white group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed]"
                    style={{ background: 'rgba(var(--color-primary),0.10)', border: '1px solid rgba(var(--color-primary),0.20)', color: 'rgb(var(--color-primary))' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  {email}
                </a>
              </li>
              <li>
                <a href={github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-medium text-muted hover:text-foreground transition-colors group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:text-white group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed]"
                    style={{ background: 'rgba(var(--color-primary),0.10)', border: '1px solid rgba(var(--color-primary),0.20)', color: 'rgb(var(--color-primary))' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                    </svg>
                  </span>
                  {stripProtocol(github)}
                </a>
              </li>
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-medium text-muted hover:text-foreground transition-colors group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:text-white group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed]"
                    style={{ background: 'rgba(var(--color-primary),0.10)', border: '1px solid rgba(var(--color-primary),0.20)', color: 'rgb(var(--color-primary))' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  {stripProtocol(linkedin)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--card-border)' }}>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} <span className="font-semibold">{name}</span>. Crafted with precision.
          </p>
          <button onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            Back to Top
            <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
