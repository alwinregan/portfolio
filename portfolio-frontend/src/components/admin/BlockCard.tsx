'use client';

import { Button } from './AdminUI';
import { Edit2, Trash2, Image as ImageIcon, Code2, FileText, Film, Quote } from 'lucide-react';

interface BlockCardProps {
  block: any;
  onEdit: (block: any) => void;
  onDelete: (id: string) => void;
}

const BLOCK_ICONS: Record<string, any> = {
  text: FileText,
  heading: FileText,
  image: ImageIcon,
  video: Film,
  code: Code2,
  quote: Quote,
  gallery: ImageIcon,
  divider: FileText,
  custom: FileText,
};

export function BlockCard({ block, onEdit, onDelete }: BlockCardProps) {
  const content = typeof block.content === 'object' ? block.content.en : block.content;
  const Icon = BLOCK_ICONS[block.type] || FileText;

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      text: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      heading: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      image: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      video: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      code: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      quote: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      gallery: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
      divider: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
      custom: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
    };
    return colors[type] || colors.text;
  };

  const getPreview = (): string => {
    switch (block.type) {
      case 'image':
        return `📷 ${block.imageUrl?.slice(-30) || 'Image'}`;
      case 'video':
        return `🎬 ${block.videoUrl?.slice(-30) || 'Video'}`;
      case 'code':
        return `💻 ${block.language || 'code'}`;
      case 'gallery':
        return `🖼️ ${block.imageUrls?.length || 0} images`;
      default:
        return content.length > 50 ? content.slice(0, 50) + '...' : content;
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all ${!block.isActive ? 'opacity-60' : ''}`}>
      {/* Type Badge & Header */}
      <div className={`p-4 ${getTypeColor(block.type)}`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon size={20} />
          <span className="font-bold text-sm capitalize">{block.type}</span>
        </div>
        {block.order !== undefined && (
          <div className="text-xs opacity-75">Order: {block.order}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Preview */}
        <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg font-mono line-clamp-3">
          {getPreview()}
        </div>

        {/* Tags */}
        {block.tags && block.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {block.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
              >
                {tag}
              </span>
            ))}
            {block.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                +{block.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          {block.config && (
            <div>
              Alignment: <span className="font-semibold">{block.config.align || 'left'}</span>
            </div>
          )}
          {!block.isActive && (
            <div className="text-amber-600 dark:text-amber-400 font-semibold">
              ⚠️ Inactive
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
          <Button
            onClick={() => onEdit(block)}
            variant="secondary"
            size="sm"
            className="flex-1"
            icon={<Edit2 size={14} />}
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(block._id || '')}
            variant="danger"
            size="sm"
            className="flex-1"
            icon={<Trash2 size={14} />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
