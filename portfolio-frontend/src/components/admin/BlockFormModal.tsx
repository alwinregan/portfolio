'use client';

import { useState } from 'react';
import { Button, InputField, TextareaField, Card } from './AdminUI';
import { ChevronDown, ChevronUp } from 'lucide-react';

const BLOCK_TYPES = [
  'text',
  'heading',
  'image',
  'video',
  'code',
  'quote',
  'gallery',
  'divider',
  'custom',
];

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'go', 'rust',
  'php', 'ruby', 'c', 'cpp', 'csharp', 'swift', 'kotlin', 'sql', 'html', 'css'
];

interface BlockFormModalProps {
  block?: any | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function BlockFormModal({ block, onSubmit, onCancel }: BlockFormModalProps) {
  const [formData, setFormData] = useState({
    type: block?.type || 'text',
    content: typeof block?.content === 'object' ? block.content.en : block?.content || '',
    metadata: typeof block?.metadata === 'object' ? block.metadata.en : block?.metadata || '',
    imageUrl: block?.imageUrl || '',
    imageUrls: block?.imageUrls?.join('\n') || '',
    videoUrl: block?.videoUrl || '',
    code: block?.code || '',
    language: block?.language || 'javascript',
    align: block?.config?.align || 'left',
    size: block?.config?.size || 'medium',
    tags: block?.tags?.join(', ') || '',
    order: block?.order || 0,
    parentId: block?.parentId || '',
    isActive: block?.isActive ?? true,
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    content: false,
    config: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        type: formData.type,
        content: { en: formData.content },
        metadata: formData.metadata ? { en: formData.metadata } : undefined,
        ...(formData.type === 'image' && { imageUrl: formData.imageUrl }),
        ...(formData.type === 'gallery' && {
          imageUrls: formData.imageUrls.split('\n').map((u: string) => u.trim()).filter(Boolean)
        }),
        ...(formData.type === 'video' && { videoUrl: formData.videoUrl }),
        ...(formData.type === 'code' && {
          code: formData.code,
          language: formData.language
        }),
        config: {
          align: formData.align,
          size: formData.size,
        },
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        order: formData.order,
        parentId: formData.parentId || undefined,
        isActive: formData.isActive,
      };

      await onSubmit(payload);
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title={block ? 'Edit Block' : 'Create New Block'} className="bg-white dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Basic Information
          </button>

          {expandedSections.basic && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Block Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {BLOCK_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                min="0"
              />

              <TextareaField
                label="Content *"
                name="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Block content text"
                rows={3}
                required
                className="lg:col-span-2"
              />

              <TextareaField
                label="Metadata (Alt text, captions, etc.)"
                name="metadata"
                value={formData.metadata}
                onChange={(e) => setFormData(prev => ({ ...prev, metadata: e.target.value }))}
                placeholder="Additional metadata"
                rows={2}
                className="lg:col-span-2"
              />
            </div>
          )}
        </div>

        {/* Content-Specific Fields */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('content')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.content ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Type-Specific Content
          </button>

          {expandedSections.content && (
            <div className="space-y-6 mt-6">
              {(formData.type === 'image') && (
                <InputField
                  label="Image URL *"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  required
                />
              )}

              {(formData.type === 'gallery') && (
                <TextareaField
                  label="Image URLs (one per line) *"
                  name="imageUrls"
                  value={formData.imageUrls}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrls: e.target.value }))}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  rows={4}
                  required
                />
              )}

              {(formData.type === 'video') && (
                <InputField
                  label="Video URL *"
                  name="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://..."
                  required
                />
              )}

              {(formData.type === 'code') && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <TextareaField
                    label="Code *"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="// Your code here"
                    rows={6}
                    required
                  />
                </>
              )}

              {(formData.type !== 'divider') && (
                <InputField
                  label="Tags (comma-separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              )}
            </div>
          )}
        </div>

        {/* Configuration */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('config')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.config ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Configuration
          </button>

          {expandedSections.config && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Alignment
                </label>
                <select
                  value={formData.align}
                  onChange={(e) => setFormData(prev => ({ ...prev, align: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer md:col-span-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-primary"
                />
                <span className="font-semibold text-sm">Active</span>
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : block ? 'Update Block' : 'Create Block'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
