
import { Mail } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function ContactForm() {
  const { profileEmail, profileGithub, profileLinkedin } = useSettings();

  return (
    <section id="contact" className="dark-section py-20 md:py-32 relative overflow-hidden">
      {/* Subtle dot grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.25em] mb-4" style={{ color: 'rgb(var(--color-primary))' }}>
              Get In Touch
            </p>
            <h3 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              Let's Build Something <br />
              <span className="text-gradient">Amazing Together</span>
            </h3>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
              Available for full-stack development roles, technical consultation, and collaborative projects
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="premium-card p-8">
                <h4 className="text-xl font-bold mb-6 text-white">Contact Information</h4>
                <div className="space-y-6">
                  {profileEmail && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(var(--color-primary) / 0.18)' }}>
                        <Mail size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Email</div>
                        <a href={`mailto:${profileEmail}`}
                          className="text-white font-semibold hover:text-primary transition-colors break-words text-sm">
                          {profileEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileGithub && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary"
                        style={{ background: 'rgba(var(--color-primary) / 0.18)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>GitHub</div>
                        <a href={profileGithub} target="_blank" rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-primary transition-colors break-words text-sm">
                          {profileGithub.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  {profileLinkedin && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary"
                        style={{ background: 'rgba(var(--color-primary) / 0.18)' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>LinkedIn</div>
                        <a href={profileLinkedin} target="_blank" rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-primary transition-colors break-words text-sm">
                          {profileLinkedin.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
