
import { ReactNode } from 'react';
;
import { Code } from 'lucide-react';

export type BlockType = 'text' | 'heading' | 'image' | 'video' | 'code' | 'quote' | 'gallery' | 'divider' | 'custom';

export interface Block {
  _id: string;
  type: BlockType;
  content: Record<string, string>;
  metadata?: Record<string, string>;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  code?: string;
  language?: string;
  config?: {
    align?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    theme?: string;
  };
  tags?: string[];
  order?: number;
  isActive?: boolean;
}

interface BlockRendererProps {
  block: Block;
  language?: string;
}

export function BlockRenderer({ block, language = 'en' }: BlockRendererProps) {
  if (!block.isActive) return null;

  const content = typeof block.content === 'object'
    ? block.content[language] || block.content.en
    : block.content;

  const metadata = typeof block.metadata === 'object'
    ? block.metadata[language] || block.metadata.en
    : block.metadata;

  const align = block.config?.align || 'left';
  const size = block.config?.size || 'medium';

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[size];

  switch (block.type) {
    case 'text':
      return (
        <div className={`prose dark:prose-invert max-w-none py-4 ${alignClass} ${sizeClass}`}>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      );

    case 'heading':
      return (
        <div className={`py-6 ${alignClass}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {content}
          </h2>
        </div>
      );

    case 'image':
      return (
        <div className={`py-6 ${alignClass}`}>
          <figure className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video max-w-4xl rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={block.imageUrl || ''}
                alt={metadata || content}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {metadata && (
              <figcaption className="text-sm text-slate-600 dark:text-slate-400 italic">
                {metadata}
              </figcaption>
            )}
          </figure>
        </div>
      );

    case 'video':
      return (
        <div className={`py-6 ${alignClass}`}>
          <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden bg-slate-900">
            <iframe
              width="100%"
              height="100%"
              src={block.videoUrl}
              title={content}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
          {metadata && (
            <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-4 text-center">
              {metadata}
            </p>
          )}
        </div>
      );

    case 'code':
      return (
        <div className={`py-6 ${alignClass}`}>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 dark:bg-slate-950 rounded-t-lg border border-b-0 border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Code size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">
                  {block.language || 'code'}
                </span>
              </div>
            </div>
            <pre className="px-4 py-4 bg-slate-950 text-slate-100 font-mono text-sm overflow-x-auto rounded-b-lg border border-slate-700">
              <code>{block.code}</code>
            </pre>
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className={`py-8 ${alignClass}`}>
          <blockquote className="border-l-4 border-primary pl-6 py-2">
            <p className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white italic">
              "{content}"
            </p>
            {metadata && (
              <footer className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                — {metadata}
              </footer>
            )}
          </blockquote>
        </div>
      );

    case 'gallery':
      return (
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {block.imageUrls?.map((imageUrl, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                <img
                  src={imageUrl}
                  alt={`Gallery image ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          {metadata && (
            <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-4 text-center">
              {metadata}
            </p>
          )}
        </div>
      );

    case 'divider':
      return (
        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <hr className="border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      );

    case 'custom':
      return (
        <div className="py-6">
          <div
            className="prose dark:prose-invert max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );

    default:
      return null;
  }
}

interface BlocksContainerProps {
  blocks: Block[];
  language?: string;
}

export function BlocksContainer({ blocks, language = 'en' }: BlocksContainerProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p>No content blocks to display</p>
      </div>
    );
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-2">
      {sortedBlocks.map((block) => (
        <BlockRenderer key={block._id} block={block} language={language} />
      ))}
    </div>
  );
}
