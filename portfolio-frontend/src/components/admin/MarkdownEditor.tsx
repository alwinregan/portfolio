'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Eye, EyeOff } from 'lucide-react';
import { MarkdownRenderer } from '../MarkdownRenderer';

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder = 'Enter markdown content...',
  required = false,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);

  const syntaxCheatsheet = [
    { label: 'Heading 1', syntax: '# Heading 1' },
    { label: 'Heading 2', syntax: '## Heading 2' },
    { label: 'Heading 3', syntax: '### Heading 3' },
    { label: 'Bold', syntax: '**bold text**' },
    { label: 'Italic', syntax: '*italic text*' },
    { label: 'Link', syntax: '[link text](https://example.com)' },
    { label: 'Code', syntax: '`code`' },
    { label: 'Code Block', syntax: '```\\ncode\\n```' },
    { label: 'List', syntax: '- Item 1\\n- Item 2' },
    { label: 'Ordered List', syntax: '1. Item 1\\n2. Item 2' },
    { label: 'Blockquote', syntax: '> Quote' },
    { label: 'Horizontal Rule', syntax: '---' },
  ];

  const insertSyntax = (syntax: string) => {
    const textarea = document.querySelector('textarea[data-markdown-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const newValue = before + syntax + after;

    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + syntax.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {showPreview ? (
              <>
                <Code2 size={14} /> Editor
              </>
            ) : (
              <>
                <Eye size={14} /> Preview
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
            className="flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {showSyntaxHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Syntax Help
          </button>
        </div>
      </div>

      {/* Editor */}
      {!showPreview && (
        <div className="space-y-2">
          <textarea
            data-markdown-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            rows={8}
          />
          <p className="text-xs text-slate-500">Markdown syntax is supported</p>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
          <MarkdownRenderer content={value} />
        </div>
      )}

      {/* Syntax Help */}
      {showSyntaxHelp && (
        <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
          {syntaxCheatsheet.map((item) => (
            <button
              key={item.syntax}
              type="button"
              onClick={() => insertSyntax(item.syntax)}
              className="text-left px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-primary hover:text-white hover:border-primary transition-colors"
              title="Click to insert"
            >
              <span className="block font-bold text-slate-900 dark:text-white">{item.label}</span>
              <span className="text-slate-500 dark:text-slate-400">{item.syntax}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
