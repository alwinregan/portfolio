'use client';

import { Button, Badge } from './AdminUI';
import { Edit2, Trash2, Star, Eye, EyeOff } from 'lucide-react';

interface AppCardProps {
  app: any;
  onEdit: (app: any) => void;
  onDelete: (id: string) => void;
}

export function AppCard({ app, onEdit, onDelete }: AppCardProps) {
  const name = typeof app.name === 'object' ? app.name.en : app.name;
  const description = typeof app.description === 'object' ? app.description.en : app.description;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-6 transition-all hover:shadow-lg ${!app.isActive ? 'opacity-60' : ''}`}
      style={{ borderColor: app.color || '#E2E8F0' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {app.icon && (
            <div className="text-3xl">
              {app.icon.startsWith('http') || app.icon.startsWith('/') ? (
                <img src={app.icon} alt="icon" className="w-12 h-12 rounded-lg" />
              ) : (
                app.icon
              )}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">v{app.version || '1.0.0'}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {description}
      </p>

      {/* URL */}
      {app.url && (
        <a
          href={app.url.startsWith('/') ? app.url : app.url}
          target={app.url.startsWith('http') ? '_blank' : undefined}
          rel={app.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-xs text-primary hover:underline mb-4 block truncate"
        >
          {app.url}
        </a>
      )}

      {/* Tags */}
      {app.tags && app.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {app.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
            >
              {tag}
            </span>
          ))}
          {app.tags.length > 2 && (
            <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
              +{app.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Status Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {app.featured && (
          <Badge variant="warning" className="text-xs">
            <Star size={10} className="mr-1" />
            Featured
          </Badge>
        )}
        <Badge
          variant={app.published ? 'success' : 'secondary'}
          className="text-xs"
        >
          {app.published ? (
            <>
              <Eye size={10} className="mr-1" />
              Published
            </>
          ) : (
            <>
              <EyeOff size={10} className="mr-1" />
              Draft
            </>
          )}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
        <Button
          onClick={() => onEdit(app)}
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<Edit2 size={14} />}
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(app._id || '')}
          variant="danger"
          size="sm"
          className="flex-1"
          icon={<Trash2 size={14} />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
