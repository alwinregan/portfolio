'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Simple markdown renderer without external dependencies
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, idx) => {
      // Code blocks
      if (para.startsWith('```')) {
        const lines = para.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        return (
          <pre key={idx} className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto my-4 text-sm">
            <code>{code}</code>
          </pre>
        );
      }

      // Headings
      if (para.startsWith('# ')) {
        return <h1 key={idx} className="text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-4">{para.replace('# ', '')}</h1>;
      }
      if (para.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4">{para.replace('## ', '')}</h2>;
      }
      if (para.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-3">{para.replace('### ', '')}</h3>;
      }

      // Lists
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').filter(line => line.startsWith('- ') || line.startsWith('* '));
        return (
          <ul key={idx} className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 my-4 ml-4">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s/, '')}</li>
            ))}
          </ul>
        );
      }

      // Regular paragraphs
      return <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed my-4">{para}</p>;
    });
  };

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
}
