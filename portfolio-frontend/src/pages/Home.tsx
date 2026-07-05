import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/features/Hero';
import Projects from '@/components/features/Projects';
import SkillsShowcase from '@/components/features/Skills';
import ExperienceTimeline from '@/components/features/Experience';
import Certifications from '@/components/features/Certifications';
import ContactForm from '@/components/features/ContactForm';
import AppLauncher from '@/components/features/AppLauncher';
import Footer from '@/components/layout/Footer';
import { t } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getProfile, getProjects, getSkills, getExperiences,
  getCertifications, getSettings, getApps,
} from '@/lib/api';

/* Default section config — merged with saved layout from DB */
export const DEFAULT_SECTIONS = [
  { id: 'hero',           label: 'Hero',           visible: true,  locked: true,  order: 0 },
  { id: 'about',          label: 'About',          visible: true,  locked: false, order: 1 },
  { id: 'projects',       label: 'Projects',       visible: true,  locked: false, order: 2 },
  { id: 'skills',         label: 'Skills',         visible: true,  locked: false, order: 3 },
  { id: 'experience',     label: 'Experience',     visible: true,  locked: false, order: 4 },
  { id: 'certifications', label: 'Certifications', visible: true,  locked: false, order: 5 },
  { id: 'contact',        label: 'Contact',        visible: true,  locked: false, order: 6 },
];

export default function HomePage() {
  const [data, setData] = useState<any>({
    profile: null, projects: [], skills: [], experience: [],
    certifications: [], settings: null, apps: [],
  });

  useEffect(() => {
    Promise.all([
      getProfile(), getProjects(), getSkills(), getExperiences(),
      getCertifications(), getSettings(), getApps(),
    ]).then(([profile, projects, skills, experience, certifications, settings, apps]) => {
      setData({ profile, projects: projects || [], skills: skills || [], experience: experience || [], certifications: certifications || [], settings, apps: apps || [] });
      if (profile?.name) document.title = `${profile.name} | Full Stack Engineer`;
    }).catch(console.error);
  }, []);

  const { profile, projects, skills, experience, certifications, settings, apps } = data;
  const apiBase = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');

  /* Merge saved layout with defaults + custom sections, sort by order */
  const savedSections: any[] = settings?.metadata?.pageLayout?.sections ?? [];
  const customSectionData: any[] = settings?.metadata?.customSections ?? [];
  const customSectionMap = Object.fromEntries(customSectionData.map((s: any) => [s.id, s]));
  const savedMap = Object.fromEntries(savedSections.map((s: any) => [s.id, s]));

  // Custom sections that appear in the saved layout
  const customDefs = savedSections
    .filter((s: any) => s.id.startsWith('custom_'))
    .map((s: any) => ({ id: s.id, label: s.label || customSectionMap[s.id]?.title || 'Custom', visible: true, locked: false, order: s.order ?? 99 }));

  const sections = [...DEFAULT_SECTIONS, ...customDefs]
    .map(def => ({ ...def, ...(savedMap[def.id] ?? {}) }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const resumeHref = profile?.resumeUrl
    ? (profile.resumeUrl.startsWith('/') ? `${apiBase}${profile.resumeUrl}` : profile.resumeUrl)
    : null;

  const renderSection = (s: typeof DEFAULT_SECTIONS[0] & { visible: boolean }) => {
    if (!s.visible && !s.locked) return null;

    switch (s.id) {
      case 'hero':
        return (
          <Hero key="hero"
            profile={profile}
            projectCount={projects?.length || 0}
            skillCount={skills?.length || 0}
            yearsValue={settings?.metadata?.aboutStats?.yearsValue || '5+'}
          />
        );

      case 'about':
        return (
          <section key="about" id="about" className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'var(--section-alt-bg)' }}>
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center max-w-7xl mx-auto">
                {/* avatar */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl group">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl.startsWith('/') ? `${apiBase}${profile.avatarUrl}` : profile.avatarUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(var(--color-primary), 0.06)' }}>
                          <span className="text-9xl font-bold" style={{ color: 'rgba(var(--color-primary), 0.2)' }}>{profile?.name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* content */}
                <div className="lg:col-span-3 space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                      Professional Bio
                    </div>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                      Building the Future,{' '}
                      <span className="text-gradient">One Line at a Time</span>
                    </h3>
                    <div className="w-20 h-1 bg-primary rounded-full mb-8" />
                  </div>

                  <div className="text-lg leading-relaxed space-y-5">
                    {t(profile?.about)?.split('\n\n').map((para: string, i: number) => (
                      <p key={i} className="text-slate-700 dark:text-slate-300 leading-[1.8]">{para}</p>
                    )) || <p className="text-slate-700 dark:text-slate-300">Full-stack engineer building high-performance digital products.</p>}
                  </div>

                  {/* Philosophy Quote */}
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pl-4 py-0.5"
                    style={{ borderLeft: '2px solid rgba(124,58,237,0.5)' }}
                  >
                    <p className="text-base italic text-slate-600 dark:text-slate-400 leading-relaxed">
                      "Make it work. Make it right. Make it fast."
                    </p>
                    <cite className="not-italic text-[10px] uppercase tracking-widest font-semibold text-slate-400 mt-1 block">
                      — Kent Beck
                    </cite>
                  </motion.blockquote>

                  {/* stats — neutral numbers, no color noise */}
                  {settings?.featureToggles?.showAboutStats !== false && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                      {[
                        { key: 'aboutStat_years',    value: settings?.metadata?.aboutStats?.yearsValue || '06+',                                                         label: 'Years' },
                        { key: 'aboutStat_projects', value: `${projects?.length || 0}+`,                                                                                  label: 'Projects' },
                        { key: 'aboutStat_tech',     value: `${skills?.length || 0}+`,                                                                                    label: 'Technologies' },
                        { key: 'aboutStat_custom',   value: settings?.metadata?.aboutStats?.stat4Value || '₹50Cr+', label: settings?.metadata?.aboutStats?.stat4Label || 'Collected' },
                      ]
                      .filter(({ key }) => settings?.featureToggles?.[key] !== false)
                      .map(({ value, label }) => (
                        <div key={label} className="premium-card p-5 text-center">
                          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resume CTA */}
                  {resumeHref && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-4 pt-2"
                    >
                      <a href={resumeHref} target="_blank" rel="noopener noreferrer" download
                        className="group inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                        style={{ background: '#7c3aed', boxShadow: '0 8px 24px rgba(124,58,237,0.30)' }}>
                        <Download size={20} />
                        Download Resume
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                      <Link to="projects"
                        className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                        style={{ background: 'rgba(124,58,237,0.08)', border: '2px solid #7c3aed', color: '#6d28d9' }}>
                        View Projects
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'projects':
        return <Projects key="projects" projects={projects || []} showStats={settings?.featureToggles?.showProjectsStats !== false} limit={3}
          statVisibility={{
            count:   settings?.featureToggles?.projectsStat_count   !== false,
            tech:    settings?.featureToggles?.projectsStat_tech    !== false,
            years:   settings?.featureToggles?.projectsStat_years   !== false,
            clients: settings?.featureToggles?.projectsStat_clients !== false,
          }} />;

      case 'skills':
        return <SkillsShowcase key="skills" initialSkills={skills || []} />;

      case 'experience':
        return <ExperienceTimeline key="experience" experience={experience || []} yearsValue={settings?.metadata?.aboutStats?.yearsValue || '5+'} />;

      case 'certifications':
        return <Certifications key="certifications" certifications={certifications || []} />;

      case 'contact':
        return <ContactForm key="contact" profileEmail={profile?.email} />;

      default:
        if (s.id.startsWith('custom_')) {
          const custom = customSectionMap[s.id];
          if (!custom) return null;
          return (
            <section key={s.id} id={s.id} className="py-24 relative overflow-hidden">
              <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                    {custom.subtitle || custom.title}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    {custom.title}
                  </h2>
                  <div className="w-20 h-1 bg-primary rounded-full" />
                </div>
                <div className="premium-card p-8">
                  {custom.content?.split('\n\n').map((para: string, i: number) => (
                    <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return null;
    }
  };

  return (
    <main className="min-h-screen selection:bg-primary/20 scroll-smooth">
      <Navbar resumeUrl={resumeHref} />
      {sections.map(s => renderSection(s as any))}
      {apps?.length > 0 && <AppLauncher apps={apps} />}
      <Footer profileName={profile?.name} />
    </main>
  );
}
