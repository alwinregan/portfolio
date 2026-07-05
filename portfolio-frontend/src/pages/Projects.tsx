import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Github, Globe, Calendar, User, ArrowUpRight, Folder } from 'lucide-react';
import { LoadingSpinner, Badge } from '@/components/admin/AdminUI';
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
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Projects | Portfolio';
    getProjects().then((data: any) => {
      const d = data || [];
      setProjects(d);
      const tags = new Set<string>();
      d.forEach((p: Project) => p.tags?.forEach(t => tags.add(t)));
      setAllTags(Array.from(tags).sort());
      setFilteredProjects(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    setFilteredProjects(tag === null ? projects : projects.filter(p => p.tags?.includes(tag)));
  };

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">Featured Projects</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">Explore a selection of projects showcasing full-stack expertise, modern technologies, and creative problem-solving.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {allTags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Filter by Technology:</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleTagFilter(null)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedTag === null ? 'bg-primary text-white' : 'text-muted hover:text-primary hover:border-primary/50 transition-colors'}`}>
                All Projects ({projects.length})
              </button>
              {allTags.map(tag => (
                <button key={tag} onClick={() => handleTagFilter(tag)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedTag === tag ? 'bg-primary text-white' : 'text-muted hover:text-primary hover:border-primary/50 transition-colors'}`}>
                  {tag} ({projects.filter(p => p.tags?.includes(tag)).length})
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">Showing {filteredProjects.length} of {projects.length} projects</div>
          </div>
        )}

        {featuredProjects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2"><Star size={28} className="text-amber-500" /> Featured</h2>
            <div className="grid grid-cols-1 gap-8">{featuredProjects.map(p => <ProjectCard key={p._id} project={p} featured />)}</div>
          </section>
        )}

        <section>
          {featuredProjects.length > 0 && <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">All Projects</h2>}
          {filteredProjects.length === 0
            ? <div className="text-center py-16"><p className="text-xl text-slate-600 dark:text-slate-400">No projects found with the selected filters.</p></div>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{otherProjects.map(p => <ProjectCard key={p._id} project={p} />)}</div>
          }
        </section>
      </div>
      <Footer />
    </main>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const title = typeof project.title === 'object' ? (project.title as any).en : project.title;
  const description = typeof project.description === 'object' ? (project.description as any).en : project.description;

  return (
    <div className={`premium-card group overflow-hidden hover:border-primary/40 transition-all ${featured ? 'lg:grid lg:grid-cols-5' : ''}`}>
      {project.imageUrl ? (
        <Link to={`/projects/${project.slug}`} className={`relative overflow-hidden block ${featured ? 'lg:col-span-2' : ''}`} style={{ aspectRatio: featured ? undefined : '16/9', background: 'var(--card-bg)' }}>
          <img src={project.imageUrl.startsWith('/') ? `${apiBase}${project.imageUrl}` : project.imageUrl} alt={title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 rounded-full shadow-lg" style={{ background: 'var(--card-bg)' }}><ArrowUpRight size={24} className="text-primary" /></div>
          </div>
        </Link>
      ) : (
        <div className={`relative flex items-center justify-center ${featured ? 'lg:col-span-2' : ''}`} style={{ aspectRatio: '16/9', background: 'rgba(var(--color-primary), 0.05)' }}>
          <Folder size={48} className="text-primary opacity-30" />
        </div>
      )}

      <div className={`p-6 ${featured ? 'lg:col-span-3 lg:flex lg:flex-col lg:justify-between' : ''}`}>
        <Link to={`/projects/${project.slug}`} className="block">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
            {featured && <Badge variant="warning" className="flex-shrink-0"><Star size={12} className="mr-1" /> Featured</Badge>}
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{description}</p>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            {project.year && <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><Calendar size={16} />{project.year}</div>}
            {project.role && <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><User size={16} />{project.role}</div>}
          </div>
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 3).map(t => <span key={t} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">{t}</span>)}
              {project.techStack.length > 3 && <span className="px-2 py-1 text-xs text-slate-500">+{project.techStack.length - 3} more</span>}
            </div>
          )}
        </Link>
        <div className="flex gap-3 pt-4 border-t border-[var(--card-border)]">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary text-sm"><Globe size={16} /> Live</a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary text-sm"><Github size={16} /> Code</a>}
        </div>
      </div>
    </div>
  );
}
