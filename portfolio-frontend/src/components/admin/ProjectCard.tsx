'use client';

import { Project } from '@/types/api';
import { Badge, Button } from './AdminUI';
import {
  Edit2,
  Trash2,
  Github,
  Globe,
  Star,
  Eye,
  EyeOff,
  Calendar,
  User,
  Briefcase,
  Code2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleFeatured?: (id: string) => Promise<void>;
  onTogglePublished?: (id: string) => Promise<void>;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: ProjectCardProps) {
  const title = typeof project.title === 'object' ? project.title.en : project.title;
  const description = typeof project.description === 'object' ? project.description.en : project.description;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow ${!project.isActive ? 'opacity-60' : ''}`}>
      {/* Cover Image */}
      {project.imageUrl && (
        <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={project.imageUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL}${project.imageUrl}` : project.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="text-white text-sm font-semibold">{project.year}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {project.featured && (
              <Badge variant="warning" className="whitespace-nowrap">
                <Star size={12} className="mr-1" />
                Featured
              </Badge>
            )}
            <Badge
              variant={project.published ? 'success' : 'secondary'}
              className="whitespace-nowrap"
            >
              {project.published ? (
                <>
                  <Eye size={12} className="mr-1" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff size={12} className="mr-1" />
                  Draft
                </>
              )}
            </Badge>
            <Badge
              variant={project.isActive ? 'success' : 'danger'}
              className="whitespace-nowrap"
            >
              {project.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
          {project.year && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar size={16} className="text-primary" />
              <span>{project.year}</span>
            </div>
          )}
          {project.role && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <User size={16} className="text-primary" />
              <span className="truncate">{project.role}</span>
            </div>
          )}
          {project.client && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 col-span-2">
              <Briefcase size={16} className="text-primary" />
              <span className="truncate">{project.client}</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Code2 size={16} />
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary/10 text-primary dark:text-primary-light rounded-lg text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                title="View on GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                title="View Live"
              >
                <Globe size={20} />
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(project)}
              variant="secondary"
              size="sm"
              icon={<Edit2 size={16} />}
              title="Edit"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(project._id || '')}
              variant="danger"
              size="sm"
              icon={<Trash2 size={16} />}
              title="Delete"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
