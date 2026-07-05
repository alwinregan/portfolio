import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Github, Globe, ArrowUpRight, Folder, Layers, ExternalLink, Code2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/admin/AdminUI';
import { getProjects } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');

interface Project {
  _id: string;
  title: Record<string, string> | string;
  slug: string;
  description: Record<string, string> | string;
  imageUrl?: string;
  techStack?: string[];
  year?: number;
  role?: string;
  client?: string;
  featured?: boolean;
  caseStudy?: boolean;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

function t(val: Record<string, string> | string | undefined) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val.en || Object.values(val)[0] || '';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Projects | Portfolio';
    getProjects().then((data: any) => {
      setProjects(data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  const totalTech = new Set(projects.flatMap(p => p.techStack || [])).size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 relative overflow-hidden" style={{ background: 'var(--section-alt-bg)' }}>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.20)', color: '#7c3aed' }}>
            <Code2 size={13} /> Portfolio Showcase
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            My <span className="text-gradient">Projects</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium mb-8 md:mb-14">
            Production-grade applications built with modern technologies, engineered for scale and exceptional user experience.
          </motion.p>

          {/* Stats */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-10">
              {[
                { value: String(projects.length), label: 'Total Projects' },
                { value: String(featuredProjects.length), label: 'Featured' },
                { value: `${totalTech}+`, label: 'Technologies' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-4xl font-black text-gradient">{value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 space-y-16 md:space-y-24">

        {/* ── Featured ── */}
        {featuredProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
                <Star size={17} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Featured Work</h2>
                <p className="text-sm text-slate-400 font-medium">{featuredProjects.length} highlighted project{featuredProjects.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="space-y-8">
              {featuredProjects.map((p, i) => (
                <FeaturedCard key={p._id} project={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── All Projects ── */}
        {otherProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.20)' }}>
                <Layers size={17} style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">All Projects</h2>
                <p className="text-sm text-slate-400 font-medium">{otherProjects.length} project{otherProjects.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <Folder size={36} style={{ color: '#7c3aed', opacity: 0.5 }} />
            </div>
            <p className="text-xl font-semibold text-slate-400">No projects yet.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   Featured card — horizontal with large image
───────────────────────────────────────────────────────────── */
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const title = t(project.title);
  const description = t(project.description);
  const imgSrc = project.imageUrl
    ? (project.imageUrl.startsWith('/') ? `${apiBase}${project.imageUrl}` : project.imageUrl)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="premium-card group overflow-hidden lg:grid lg:grid-cols-5"
    >
      {/* Image */}
      <Link to={`/projects/${project.slug}`}
        className="relative overflow-hidden block lg:col-span-2 bg-slate-100">
        <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
          {imgSrc ? (
            <img src={imgSrc} alt={title}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.05)' }}>
              <Folder size={48} style={{ color: '#7c3aed', opacity: 0.25 }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* Content */}
      <div className="lg:col-span-3 p-5 md:p-8 lg:p-10 flex flex-col justify-between gap-6">
        <div>
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)', color: '#b45309' }}>
                <Star size={11} /> Featured
              </span>
              {project.year && (
                <span className="text-xs font-semibold text-slate-400 px-2 py-1 rounded-full"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  {project.year}
                </span>
              )}
            </div>
            {project.role && (
              <span className="text-xs text-slate-400 font-medium shrink-0">{project.role}</span>
            )}
          </div>

          <Link to={`/projects/${project.slug}`}>
            <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-3 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">{description}</p>

          {/* Tech stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.slice(0, 6).map(tech => (
                <span key={tech}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg"
                  style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', color: '#6d28d9' }}>
                  {tech}
                </span>
              ))}
              {project.techStack.length > 6 && (
                <span className="px-2.5 py-1 text-xs font-semibold text-slate-400">
                  +{project.techStack.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap pt-6"
          style={{ borderTop: '1px solid var(--card-border)' }}>
          <Link to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:scale-105"
            style={{ background: '#7c3aed', boxShadow: '0 4px 16px rgba(124,58,237,0.28)' }}>
            {project.caseStudy ? 'Read Case Study' : 'View Details'}
            <ArrowUpRight size={15} />
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all hover:scale-105"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid #7c3aed', color: '#6d28d9' }}>
              <Globe size={14} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:scale-105"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
              <Github size={14} /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Standard project card — vertical 3-col grid
───────────────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const title = t(project.title);
  const description = t(project.description);
  const imgSrc = project.imageUrl
    ? (project.imageUrl.startsWith('/') ? `${apiBase}${project.imageUrl}` : project.imageUrl)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="premium-card group overflow-hidden flex flex-col"
    >
      {/* Image */}
      <Link to={`/projects/${project.slug}`} className="block relative overflow-hidden"
        style={{ background: '#f8fafc' }}>
        <div className="aspect-[16/9] relative">
          {imgSrc ? (
            <img src={imgSrc} alt={title}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.04)' }}>
              <Folder size={36} style={{ color: '#7c3aed', opacity: 0.25 }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Hover overlay icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-3 rounded-full shadow-lg backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.90)' }}>
              <ExternalLink size={20} style={{ color: '#7c3aed' }} />
            </div>
          </div>
          {project.year && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.88)', color: '#0f172a' }}>
              {project.year}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <Link to={`/projects/${project.slug}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">{description}</p>

        {/* Tech tags */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.slice(0, 4).map(tech => (
              <span key={tech}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md"
                style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', color: '#6d28d9' }}>
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid var(--card-border)' }}>
          <Link to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5"
            style={{ color: '#7c3aed' }}>
            {project.caseStudy ? 'Case Study' : 'View Details'}
            <ArrowUpRight size={14} />
          </Link>
          <div className="flex gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:text-white hover:bg-[#7c3aed]"
                title="Live Demo"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
                <Globe size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:text-white hover:bg-[#7c3aed]"
                title="Source Code"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
                <Github size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
