
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden">
      {/* top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(var(--color-primary) / 0.4), rgba(var(--color-accent) / 0.25), transparent)' }} />

      <div className="container mx-auto px-6 relative z-10 py-10">
        <div className="flex justify-center">
          <button onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            Back to Top
            <ArrowUp size={13} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
