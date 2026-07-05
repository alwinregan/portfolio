'use client';

import { useState } from 'react';
import { Button, InputField, TextareaField, Card } from './AdminUI';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AppFormModalProps {
  app?: any | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function AppFormModal({ app, onSubmit, onCancel }: AppFormModalProps) {
  const [formData, setFormData] = useState({
    name: typeof app?.name === 'object' ? app.name.en : app?.name || '',
    description: typeof app?.description === 'object' ? app.description.en : app?.description || '',
    longDescription: typeof app?.longDescription === 'object' ? app.longDescription.en : app?.longDescription || '',
    icon: app?.icon || '',
    color: app?.color || '#3B82F6',
    url: app?.url || '',
    tags: app?.tags?.join(', ') || '',
    version: app?.version || '1.0.0',
    featured: app?.featured || false,
    published: app?.published ?? true,
    isActive: app?.isActive ?? true,
    order: app?.order || 0,
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    settings: false,
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
        name: { en: formData.name },
        description: { en: formData.description },
        longDescription: formData.longDescription ? { en: formData.longDescription } : undefined,
        icon: formData.icon,
        color: formData.color,
        url: formData.url,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        version: formData.version,
        featured: formData.featured,
        published: formData.published,
        isActive: formData.isActive,
        order: formData.order,
      };

      await onSubmit(payload);
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title={app ? 'Edit App' : 'Create New App'} className="bg-white dark:bg-slate-900">
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
              <InputField
                label="App Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Analytics Dashboard"
                required
              />

              <InputField
                label="Icon (Emoji or URL)"
                name="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="📊 or https://..."
              />

              <TextareaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this app"
                rows={3}
                required
              />

              <InputField
                label="Theme Color"
                name="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />

              <InputField
                label="App URL/Route"
                name="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="/apps/analytics or https://..."
                required
              />

              <InputField
                label="Version"
                name="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0.0"
              />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Details
          </button>

          {expandedSections.details && (
            <div className="space-y-6 mt-6">
              <TextareaField
                label="Long Description"
                name="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                placeholder="Detailed description (supports markdown)"
                rows={4}
              />

              <InputField
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="dashboard, analytics, tools"
              />
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('settings')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.settings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Settings
          </button>

          {expandedSections.settings && (
            <div className="space-y-4 mt-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-primary"
                />
                <span className="font-semibold text-sm">Featured App</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-primary"
                />
                <span className="font-semibold text-sm">Published</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-primary"
                />
                <span className="font-semibold text-sm">Active</span>
              </label>

              <InputField
                label="Display Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                min="0"
              />
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
            {isSubmitting ? 'Saving...' : app ? 'Update App' : 'Create App'}
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
