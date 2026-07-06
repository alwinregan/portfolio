import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Download, Github, Globe, ExternalLink } from 'lucide-react';
import { getProjectBySlug } from '@/lib/api';
import { t } from '@/lib/utils';
import Footer from '@/components/layout/Footer';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
const imgUrl = (p?: string) => !p ? '' : p.startsWith('http') ? p : `${API_BASE}${p}`;

function FadeUp({ children, delay = 0, className = '' }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug)
      .then(d => { setProject(d); document.title = `${t(d.title)} · Case Study`; })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent animate-pulse" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Project not found</p>
      <Link to="/" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Back
      </Link>
    </div>
  );

  const cs = project.caseStudy;
  const title = t(project.title);
  const description = t(project.description);

  return cs ? (
    <CaseStudyPage project={project} cs={cs} heroRef={heroRef} heroScale={heroScale} heroOpacity={heroOpacity} />
  ) : (
    <StandardPage project={project} title={title} description={description} heroRef={heroRef} heroScale={heroScale} heroOpacity={heroOpacity} />
  );
}

/* ═══════════════════════════════════════════════════════════
   CASE STUDY PAGE
═══════════════════════════════════════════════════════════ */
function CaseStudyPage({ project, cs, heroRef, heroScale, heroOpacity }: any) {
  const title = t(project.title);
  const { scrollYProgress: docScrollY } = useScroll();

  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[90vh] min-h-[640px] overflow-hidden flex flex-col justify-end" style={{ background: '#0c1229' }}>
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {project.imageUrl && (
            <img src={imgUrl(project.imageUrl)} alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(2px) brightness(0.28)', transform: 'scale(1.05)' }} />
          )}
          {/* Dark base so any image looks consistent */}
          <div className="absolute inset-0 bg-[#0c1229]/50" />
          {/* Gradient — heavy at bottom for text, softens toward top */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.20) 100%)' }} />
        </motion.div>

        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div style={{ opacity: heroOpacity }} className="absolute top-8 left-8 md:left-16 z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> All Projects
          </Link>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-5 md:px-16 pb-10 md:pb-16 max-w-5xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-xs font-mono uppercase tracking-[0.2em] mb-6" style={{ color: 'rgba(167,139,250,0.9)' }}>
            {cs.subtitle}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.95] mb-6">
            {title}<span style={{ color: '#a78bfa' }}>.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            className="text-white/85 text-lg max-w-2xl leading-relaxed mb-8 font-light">
            {cs.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
            className="flex flex-wrap items-center gap-3 mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(167,139,250,0.22)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.45)' }}>
              {cs.meta?.developer}
            </span>
            {cs.meta?.stackHighlight?.map((s: string) => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-mono"
                style={{ color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>{s}</span>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-lg transition-all text-sm">
                <Globe size={15} /> View Live
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
            {project.pdfUrl && (
              <a href={imgUrl(project.pdfUrl)} target="_blank" download rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', color: '#f8fafc' }}>
                <Download size={15} /> Case Study PDF
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', color: '#f8fafc' }}>
                <Github size={15} /> Source
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div style={{ scaleX: docScrollY }} className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left" />
      </div>

      {/* ── SECTIONS ─────────────────────────────────────────── */}
      <div>
        {cs.sections?.map((section: any) => (
          <Section key={section.id} section={section} project={project} />
        ))}
      </div>

      {/* ── PDF BANNER ───────────────────────────────────────── */}
      {project.pdfUrl && (
        <div className="py-24">
          <div className="max-w-5xl mx-auto px-8 md:px-16">
            <div className="premium-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3">Case Study</p>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
                  Read the full<br />breakdown.
                </h3>
                <p className="text-muted max-w-md">Architecture decisions, trade-offs, and lessons from building {title} end to end.</p>
              </div>
              <a href={imgUrl(project.pdfUrl)} target="_blank" download rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-3 px-10 py-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-base rounded-xl transition-all shadow-2xl shadow-primary/25">
                <Download size={20} /> Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER NAV ───────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: 'var(--card-border)' }}>
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors font-medium text-sm group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> All Projects
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold rounded-lg transition-colors">
              <Globe size={14} /> View Live Project
            </a>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

/* ─── Section router ──────────────────────────────────────── */
function Section({ section, project }: any) {
  const base = 'max-w-5xl mx-auto px-8 md:px-16';
  switch (section.type) {
    case 'problem':    return <ProblemSection s={section} base={base} />;
    case 'solution':   return <SolutionSection s={section} base={base} />;
    case 'challenges': return <ChallengesSection s={section} base={base} />;
    case 'stack':      return <StackSection s={section} base={base} />;
    case 'impact':     return <ImpactSection s={section} base={base} project={project} />;
    default:           return null;
  }
}

/* ─── Shared section header ──────────────────────────────── */
function SectionHeader({ number, title, lead, body }: any) {
  return (
    <FadeUp className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-muted">{number}</span>
        <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
      </div>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{title}</h2>
      {lead && <p className="text-xl font-medium mb-3 text-muted">{lead}</p>}
      {body && <p className="text-base leading-relaxed max-w-2xl text-muted">{body}</p>}
    </FadeUp>
  );
}

/* ─── 01 Problem ─────────────────────────────────────────── */
function ProblemSection({ s, base }: any) {
  return (
    <section className="py-24 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <div className={base}>
        <SectionHeader {...s} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {s.items?.map((item: any, i: number) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="premium-card p-6 group hover:border-primary/40">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h4 className="font-bold mb-2 text-base">{item.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 02 Solution ────────────────────────────────────────── */
function SolutionSection({ s, base }: any) {
  return (
    <section className="py-24 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <div className={base}>
        <SectionHeader {...s} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {s.items?.map((item: any, i: number) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="premium-card p-5 group hover:border-primary/40 h-full">
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h4 className="font-bold mb-2 text-sm">{item.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 03 Engineering Challenges ──────────────────────────── */
function ChallengesSection({ s, base }: any) {
  return (
    <section className="py-24 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <div className={base}>
        <SectionHeader {...s} />
        <div className="space-y-8">
          {s.items?.map((item: any, i: number) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="premium-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="p-6">
                    <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted mb-3">The Constraint</p>
                    <h4 className="font-bold text-lg mb-3">{item.constraint}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.constraintBody}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-mono uppercase tracking-[0.15em] text-primary mb-3">The Resolution</p>
                    <h4 className="font-bold text-lg mb-3">{item.resolution}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.resolutionBody}</p>
                  </div>
                </div>
                {(item.codeBefore || item.codeAfter) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-t" style={{ borderColor: 'var(--card-border)' }}>
                    {item.codeBefore && (
                      <div className="p-5" style={{ background: 'rgba(239,68,68,0.04)' }}>
                        <p className="text-xs text-red-400/70 font-mono mb-2 uppercase tracking-wider">Before</p>
                        <pre className="text-xs text-muted font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{item.codeBefore}</pre>
                      </div>
                    )}
                    {item.codeAfter && (
                      <div className="p-5" style={{ background: 'rgba(34,197,94,0.04)' }}>
                        <p className="text-xs text-green-400/70 font-mono mb-2 uppercase tracking-wider">After</p>
                        <pre className="text-xs text-green-500 dark:text-green-300/80 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{item.codeAfter}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 04 Tech Stack ──────────────────────────────────────── */
function StackSection({ s, base }: any) {
  return (
    <section className="py-24 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <div className={base}>
        <SectionHeader {...s} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {s.categories?.map((cat: any, ci: number) => (
            <FadeUp key={cat.name} delay={ci * 0.08}>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted mb-4">{cat.name}</p>
                <div className="space-y-2">
                  {cat.items?.map((item: string, ii: number) => (
                    <div key={ii} className="premium-card flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:border-primary/40 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 05 Impact ──────────────────────────────────────────── */
function ImpactSection({ s, base, project }: any) {
  return (
    <section className="py-24">
      <div className={base}>
        <SectionHeader {...s} />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {s.stats?.map((stat: any, i: number) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="premium-card text-center p-5">
                <div className="text-3xl md:text-4xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-muted leading-tight">{stat.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {s.highlights?.map((h: any, i: number) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="premium-card p-6 hover:border-primary/40 transition-colors">
                <div className="text-2xl mb-3">{h.emoji}</div>
                <h4 className="font-bold mb-2">{h.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{h.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {project.liveUrl && (
          <FadeUp delay={0.3} className="mt-16">
            <div className="premium-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-bold text-lg mb-1">See it running in production</p>
                <p className="text-muted text-sm">Live deployment — a real gym using this every day.</p>
              </div>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl transition-colors text-sm group">
                <Globe size={16} /> Visit FitCore
                <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   STANDARD PAGE — for projects without case study data
═══════════════════════════════════════════════════════════ */
function StandardPage({ project, title, description, heroRef, heroScale, heroOpacity }: any) {
  const tags: string[] = project.tags || [];
  const stack: string[] = project.techStack || [];
  const longRaw = t(project.longDescription) || description;
  const lines = longRaw.split('\n').map((l: string) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l: string) => /^[•\-\*]/.test(l)).map((l: string) => l.replace(/^[•\-\*]\s*/, ''));
  const paras = lines.filter((l: string) => !/^[•\-\*]/.test(l));

  return (
    <main className="min-h-screen">
      <div ref={heroRef} className="relative h-[80vh] min-h-[560px] overflow-hidden flex flex-col justify-end" style={{ background: '#0c1229' }}>
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {project.imageUrl && (
            <img src={imgUrl(project.imageUrl)} alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(2px) brightness(0.28)', transform: 'scale(1.05)' }} />
          )}
          <div className="absolute inset-0 bg-[#0c1229]/50" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.20) 100%)' }} />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="absolute top-8 left-8 md:left-16 z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium group transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> All Projects
          </Link>
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-8 md:px-16 pb-14 max-w-5xl">
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full"
                style={{ color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.08)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-5">
            {title}<span style={{ color: '#a78bfa' }}>.</span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed mb-8 font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>{description}</p>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-lg text-sm transition-all">
                <Globe size={15} /> View Live
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', color: '#f8fafc' }}>
                <Github size={15} /> Source
              </a>
            )}
            {project.pdfUrl && (
              <a href={imgUrl(project.pdfUrl)} target="_blank" download
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', color: '#f8fafc' }}>
                <Download size={15} /> Case Study PDF
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-8 md:px-16 py-20 space-y-20">
        {paras.length > 0 && (
          <FadeUp>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-8">Overview</p>
            <div className="space-y-4 max-w-3xl">
              {paras.map((p: string, i: number) => (
                <p key={i} className={`leading-relaxed ${i === 0 ? 'text-xl font-medium' : 'text-base text-muted'}`}>{p}</p>
              ))}
            </div>
          </FadeUp>
        )}
        {stack.length > 0 && (
          <FadeUp>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-8">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech: string) => (
                <span key={tech} className="premium-card px-3 py-2 text-xs font-medium hover:border-primary/40 transition-colors">{tech}</span>
              ))}
            </div>
          </FadeUp>
        )}
        {bullets.length > 0 && (
          <FadeUp>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-8">Features</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bullets.map((b: string, i: number) => (
                <div key={i} className="premium-card flex items-start gap-3 p-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm text-muted leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        )}
        <div className="flex items-center justify-between pt-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> All Projects
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold rounded-lg transition-colors">
              <Globe size={14} /> Live Project
            </a>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
