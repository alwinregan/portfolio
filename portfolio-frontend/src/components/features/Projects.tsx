
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Folder, Star, Code } from 'lucide-react';
;
import { Link } from 'react-router-dom';
import { t } from '@/lib/utils';

interface StatVisibility {
  count?: boolean;
  tech?: boolean;
  years?: boolean;
  clients?: boolean;
}

interface ProjectsProps {
  projects: any[];
  showStats?: boolean;
  limit?: number;
  statVisibility?: StatVisibility;
}

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

export default function Projects({ projects, showStats = true, limit, statVisibility }: ProjectsProps) {
  const allProjects = projects.length > 0 ? projects : [];
  const displayProjects = limit ? allProjects.slice(0, limit) : allProjects;
  const hasMore = limit ? allProjects.length > limit : false;
  const sv = statVisibility ?? { count: true, tech: true, years: true, clients: true };

  return (
    <section id="projects" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Folder size={14} />
            Portfolio Showcase
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium"
          >
            Production-grade applications built with modern technologies
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayProjects.map((project, index) => (
            <motion.article
              key={project._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="premium-card overflow-hidden h-full flex flex-col cursor-pointer relative">
                {/* Project Image */}
                <Link to={`/projects/${project.slug}`} className="block relative">
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'var(--card-bg)' }}>
                    <img
                      src={project.imageUrl?.startsWith('/') ? `${API_BASE}${project.imageUrl}` : (project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97')}
                      alt={typeof project.title === 'object' ? project.title.en : project.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                    {/* Year Badge */}
                    {project.year && (
                      <div className="absolute top-4 left-4 px-3 py-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {project.year}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Quick Action Buttons - Outside Link */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 hover:bg-[#7c3aed] hover:text-white transition-all hover:scale-110"
                      title="View Live Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 hover:bg-slate-800 hover:text-white transition-all hover:scale-110"
                      title="View Source Code"
                    >
                      <Github size={16} />
                    </a>
                  )}
                </div>

                {/* Project Content */}
                <Link to={`/projects/${project.slug}`} className="block flex-1">
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title */}
                    <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                      {typeof project.title === 'object' ? project.title.en : project.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3 flex-grow">
                      {typeof project.description === 'object' ? project.description.en : project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 5).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-[10px] font-semibold rounded-md"
                              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 5 && (
                            <span className="px-2 py-1 text-[10px] font-semibold text-slate-400">
                              +{project.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Link */}
                    <div className="pt-4 border-t border-[var(--card-border)] mt-auto">
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all group/link">
                        {project.caseStudy ? 'Read Case Study' : 'View Details'}
                        <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Project Stats */}
        {showStats && displayProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-20 pt-12 border-t-2 border-[var(--card-border)]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {sv.count !== false && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">{allProjects.length}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Featured Projects</div>
                </div>
              )}
              {sv.tech !== false && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {new Set(allProjects.flatMap(p => p.techStack || [])).size}+
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Technologies</div>
                </div>
              )}
              {sv.years !== false && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {new Set(allProjects.map(p => p.year).filter(Boolean)).size}
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Years Active</div>
                </div>
              )}
              {sv.clients !== false && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {new Set(allProjects.map(p => p.client).filter(Boolean)).size}+
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Clients</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* View All button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-xl transition-all hover:scale-105"
              style={{ background: 'rgba(124,58,237,0.08)', border: '2px solid #7c3aed', color: '#6d28d9' }}
            >
              View All Projects
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
