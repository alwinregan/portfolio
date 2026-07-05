'use client';

import { useState } from 'react';
import { Project } from '@/types/api';
import {
  Button,
  InputField,
  TextareaField,
  Card
} from './AdminUI';
import {
  X,
  Plus,
  Trash2,
  Upload,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProjectFormModalProps {
  project?: Project | null;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
  uploading?: boolean;
  onImageUpload: (file: File) => Promise<string>;
}

export function ProjectFormModal({
  project,
  onSubmit,
  onCancel,
  uploading = false,
  onImageUpload,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState({
    title: typeof project?.title === 'object' ? project.title.en : project?.title || '',
    description: typeof project?.description === 'object' ? project.description.en : project?.description || '',
    longDescription: typeof project?.longDescription === 'object' ? project.longDescription.en : project?.longDescription || '',
    summary: project?.summary || '',
    client: project?.client || '',
    role: project?.role || '',
    year: project?.year || new Date().getFullYear(),
    techStack: project?.techStack?.join(', ') || '',
    tags: project?.tags?.join(', ') || '',
    body: project?.body || '',
    imageUrl: project?.imageUrl || '',
    images: project?.images?.join('\n') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    pdfUrl: (project as any)?.pdfUrl || '',
    featured: project?.featured || false,
    published: project?.published ?? true,
    isActive: project?.isActive ?? true,
    order: project?.order || 0,
  });

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    content: false,
    media: true,
    settings: false,
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const url = await onImageUpload(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: { en: formData.title },
        description: { en: formData.description },
        longDescription: formData.longDescription ? { en: formData.longDescription } : undefined,
        summary: formData.summary,
        client: formData.client,
        role: formData.role,
        year: formData.year,
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        body: formData.body,
        imageUrl: formData.imageUrl,
        images: formData.images.split('\n').map(i => i.trim()).filter(Boolean),
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        pdfUrl: formData.pdfUrl,
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
    <Card title={project ? 'Edit Project' : 'Create New Project'} className="bg-white dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Basic Details
          </button>

          {expandedSections.details && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <InputField
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="My Awesome Project"
                required
              />

              <InputField
                label="Client/Company"
                name="client"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                placeholder="e.g., TechCorp Inc"
              />

              <TextareaField
                label="Short Description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief project description"
                rows={3}
                required
              />

              <InputField
                label="Your Role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Full Stack Developer"
              />

              <InputField
                label="Summary"
                name="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Longer summary for portfolio display"
              />

              <InputField
                label="Year Completed"
                name="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('content')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.content ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Content & Metadata
          </button>

          {expandedSections.content && (
            <div className="space-y-6 mt-6">
              <TextareaField
                label="Long Description"
                name="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                placeholder="Detailed project description"
                rows={4}
              />

              <TextareaField
                label="Markdown Body"
                name="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Markdown content for detailed project page"
                rows={6}
              />

              <InputField
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="fullstack, ecommerce, saas"
              />
            </div>
          )}
        </div>

        {/* Media */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('media')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.media ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Media
          </button>

          {expandedSections.media && (
            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  {formData.imageUrl ? (
                    <div className="relative group">
                      <img
                        src={formData.imageUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL}${formData.imageUrl}` : formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-4 py-12">
                      <Upload size={32} className="text-slate-400" />
                      <div className="text-center">
                        <span className="font-bold text-sm block">Upload Cover Image</span>
                        <span className="text-xs text-slate-500">JPG, PNG, WEBP (Max 10MB)</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                        disabled={imageUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <TextareaField
                label="Additional Images (one URL per line)"
                name="images"
                value={formData.images}
                onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={4}
              />

              <InputField
                label="Tech Stack (comma-separated)"
                name="techStack"
                value={formData.techStack}
                onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
                placeholder="React, Node.js, MongoDB, Stripe"
                required
              />
            </div>
          )}
        </div>

        {/* Links & Settings */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            type="button"
            onClick={() => toggleSection('settings')}
            className="flex items-center gap-2 w-full font-bold text-lg text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {expandedSections.settings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Links & Settings
          </button>

          {expandedSections.settings && (
            <div className="space-y-6 mt-6">
              <InputField
                label="Live Demo URL"
                name="liveUrl"
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://project-demo.com"
              />

              <InputField
                label="GitHub Repository URL"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/user/repo"
              />

              <InputField
                label="Case Study PDF URL"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, pdfUrl: e.target.value }))}
                placeholder="Upload PDF via Media Library, paste URL here"
              />

              <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 text-primary"
                  />
                  <span className="font-semibold text-sm">Featured Project</span>
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
                  <span className="font-semibold text-sm">Active (Visible on site)</span>
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
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
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
