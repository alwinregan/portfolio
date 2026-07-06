import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { LoadingSpinner, EmptyState, Button } from '@/components/admin/AdminUI';
import { getAdminProjects, updateProject, deleteProject, importProjects } from '@/lib/api';
import {
  Plus, Trash2, Edit2, Globe, Github, Image as ImageIcon,
  Star, Eye, EyeOff, FolderOpen, Activity, BookOpen,
  Download, Upload, ExternalLink, GripVertical, CheckCircle, AlertCircle,
} from 'lucide-react';

const tv = (v: any) => (typeof v === 'object' && v !== null ? v.en ?? '' : v ?? '');
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
const imgSrc = (u: string) => !u ? '' : u.startsWith('/') ? `${API_BASE}${u}` : u;

export default function ProjectsAdminPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; failed: number; errors: string[] } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  /* ── drag state ── */
  const dragId   = useRef<string | null>(null);
  const dragOver = useRef<string | null>(null);
  const [dragActiveId, setDragActiveId]   = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await getAdminProjects();
      setProjects((data || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
    } finally { setLoading(false); }
  };

  /* ── quick field toggle ── */
  const toggle = async (p: any, field: 'published' | 'isActive' | 'featured') => {
    if (toggling) return;
    setToggling(`${p._id}-${field}`);
    try {
      await updateProject(p._id, { [field]: !p[field] });
      setProjects(prev => prev.map(x => x._id === p._id ? { ...x, [field]: !p[field] } : x));
    } finally { setToggling(null); }
  };

  const toggleType = async (p: any) => {
    if (toggling) return;
    const next = p.projectType === 'personal' ? 'work' : 'personal';
    setToggling(`${p._id}-projectType`);
    try {
      await updateProject(p._id, { projectType: next });
      setProjects(prev => prev.map(x => x._id === p._id ? { ...x, projectType: next } : x));
    } finally { setToggling(null); }
  };

  /* ── drag handlers ── */
  const onDragStart = (e: React.DragEvent, id: string) => {
    dragId.current = id;
    setDragActiveId(id);
    e.dataTransfer.effectAllowed = 'move';
    // ghost image — native works fine
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragId.current) {
      dragOver.current = id;
      setDragOverId(id);
    }
  };

  const onDragEnd = () => {
    const srcId  = dragId.current;
    const destId = dragOver.current;
    dragId.current   = null;
    dragOver.current = null;
    setDragActiveId(null);
    setDragOverId(null);

    if (!srcId || !destId || srcId === destId) return;

    setProjects(prev => {
      const list = [...prev];
      const srcIdx  = list.findIndex(p => p._id === srcId);
      const destIdx = list.findIndex(p => p._id === destId);
      if (srcIdx === -1 || destIdx === -1) return prev;

      const [moved] = list.splice(srcIdx, 1);
      list.splice(destIdx, 0, moved);

      // assign order = index and save in background
      const reordered = list.map((p, i) => ({ ...p, order: i }));
      saveOrder(reordered);
      return reordered;
    });
  };

  const saveOrder = async (list: any[]) => {
    setSavingOrder(true);
    try {
      await Promise.all(list.map(p => updateProject(p._id, { order: p.order })));
    } finally { setSavingOrder(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  const handleExport = async () => {
    const data = await getAdminProjects();
    const clean = (data as any[]).map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest);
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : parsed.projects;
      if (!Array.isArray(arr)) throw new Error('JSON must be an array of projects');
      const result = await importProjects(arr);
      setImportResult(result);
      await load();
    } catch (err: any) {
      setImportResult({ created: 0, updated: 0, failed: 1, errors: [err.message] });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  if (loading) return (
    <AdminLayout title="Projects" subtitle="Manage your portfolio projects">
      <div className="flex items-center justify-center py-32"><LoadingSpinner size="lg" /></div>
    </AdminLayout>
  );

  const featured  = projects.filter(p => p.featured || p.isFeatured).length;
  const published = projects.filter(p => p.published !== false).length;

  return (
    <AdminLayout title="Projects" subtitle="Manage your portfolio projects and showcases">
      <div className="space-y-6">

        {/* stats + actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 font-medium">Total <span className="text-primary font-black ml-1">{projects.length}</span></span>
            <span className="text-slate-500 font-medium">Published <span className="text-emerald-600 font-black ml-1">{published}</span></span>
            <span className="text-slate-500 font-medium">Featured <span className="text-amber-600 font-black ml-1">{featured}</span></span>
            {savingOrder && <span className="text-xs text-primary font-medium flex items-center gap-1.5"><LoadingSpinner size="sm" /> Saving order…</span>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
              title="Export all projects as JSON"
            >
              <Download size={15} /> Export JSON
            </button>
            {/* Import */}
            <button
              onClick={() => importInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all disabled:opacity-60"
              title="Import projects from JSON file (images skipped — add via Edit)"
            >
              {importing ? <LoadingSpinner size="sm" /> : <Upload size={15} />}
              Import JSON
            </button>
            <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
            <Button onClick={() => navigate('/admin/projects/new')} variant="primary" icon={<Plus size={16} />}>
              New Project
            </Button>
          </div>
        </div>

        {/* Import result banner */}
        {importResult && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
            importResult.failed > 0
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
          }`}>
            {importResult.failed > 0 ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle size={18} className="shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold">
                Import complete — {importResult.created} created, {importResult.updated} updated
                {importResult.failed > 0 ? `, ${importResult.failed} failed` : ''}
              </p>
              {importResult.errors.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                  {importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              )}
              <p className="text-xs mt-1 opacity-70">Images were skipped — add them via the Edit button on each project.</p>
            </div>
            <button onClick={() => setImportResult(null)} className="ml-auto text-current opacity-50 hover:opacity-100">✕</button>
          </div>
        )}

        {/* drag hint */}
        {projects.length > 1 && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <GripVertical size={13} /> Drag the grip handle to reorder projects on the frontend
          </p>
        )}

        {/* list */}
        {projects.length === 0 ? (
          <EmptyState icon={<FolderOpen size={48} />} title="No Projects Yet"
            description="Start building your portfolio by adding your first project"
            action={<Button onClick={() => navigate('/admin/projects/new')} variant="primary" icon={<Plus size={18} />}>Add First Project</Button>} />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const title      = tv(project.title);
              const desc       = tv(project.description);
              const isPublished = project.published !== false;
              const isActive    = project.isActive !== false;
              const isFeatured  = project.featured || project.isFeatured;
              const hasCaseStudy = !!project.caseStudy;
              const hasPdf       = !!project.pdfUrl;
              const isDragging   = dragActiveId === project._id;
              const isOver       = dragOverId   === project._id;

              return (
                <div key={project._id}
                  draggable
                  onDragStart={e => onDragStart(e, project._id)}
                  onDragOver={e  => onDragOver(e, project._id)}
                  onDragEnd={onDragEnd}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border-2 overflow-hidden transition-all select-none
                    ${isDragging ? 'opacity-40 scale-[0.99] border-primary/50 shadow-lg' : ''}
                    ${isOver && !isDragging ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-200 dark:border-slate-800'}
                    ${!isActive ? 'opacity-60' : ''}
                  `}>

                  {/* top status bar */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-wrap">
                    {/* drag grip */}
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 mr-1">
                      <GripVertical size={15} />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">#{project.order ?? 0}</span>
                    <span className="text-xs text-slate-400 font-mono">/{project.slug}</span>
                    {project.year && <span className="text-xs text-slate-400">{project.year}</span>}
                    <div className="flex-1" />
                    {hasCaseStudy && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold rounded-full">
                        <BookOpen size={10} /> Case Study
                      </span>
                    )}
                    {hasPdf && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                        <Download size={10} /> PDF
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full ${isPublished ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                      {isPublished ? <Eye size={10} /> : <EyeOff size={10} />} {isPublished ? 'Published' : 'Draft'}
                    </span>
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
                        <Star size={10} /> Featured
                      </span>
                    )}
                  </div>

                  <div className="flex">
                    {/* thumbnail */}
                    <div className="hidden sm:block w-36 h-36 shrink-0 bg-slate-100 dark:bg-slate-800">
                      {project.imageUrl ? (
                        <img src={imgSrc(project.imageUrl)} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>

                    {/* main info */}
                    <div className="flex-1 min-w-0 p-5">
                      <div className="mb-1">
                        <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">{title}</h3>
                        {project.client && <p className="text-xs text-slate-500 mt-0.5">{project.client}{project.role ? ` · ${project.role}` : ''}</p>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{desc}</p>

                      {/* tech chips */}
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(project.techStack as string[]).slice(0, 6).map((t: string) => (
                            <span key={t} className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">{t}</span>
                          ))}
                          {project.techStack.length > 6 && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold rounded-lg">+{project.techStack.length - 6}</span>
                          )}
                        </div>
                      )}

                      {/* bottom row */}
                      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {/* quick toggles */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <QuickToggle active={isPublished} label={isPublished ? 'Published' : 'Draft'}
                            icon={isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                            activeColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                            inactiveColor="bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                            loading={toggling === `${project._id}-published`}
                            onClick={() => toggle(project, 'published')} />
                          <QuickToggle active={isActive} label={isActive ? 'Active' : 'Hidden'}
                            icon={<Activity size={12} />}
                            activeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200"
                            inactiveColor="bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                            loading={toggling === `${project._id}-isActive`}
                            onClick={() => toggle(project, 'isActive')} />
                          <QuickToggle active={isFeatured} label={isFeatured ? 'Featured' : 'Feature?'}
                            icon={<Star size={12} />}
                            activeColor="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200"
                            inactiveColor="bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                            loading={toggling === `${project._id}-featured`}
                            onClick={() => toggle(project, 'featured')} />
                          <QuickToggle active={project.projectType === 'personal'}
                            label={project.projectType === 'personal' ? 'Personal' : 'Work'}
                            icon={project.projectType === 'personal' ? <Activity size={12} /> : <FolderOpen size={12} />}
                            activeColor="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200"
                            inactiveColor="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200"
                            loading={toggling === `${project._id}-projectType`}
                            onClick={() => toggleType(project)} />
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-2">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-primary transition-colors" title="View Live">
                              <Globe size={15} />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors" title="GitHub">
                              <Github size={15} />
                            </a>
                          )}
                          <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors" title="View on site">
                            <ExternalLink size={15} />
                          </a>
                          <Link to={`/admin/projects/${project._id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold rounded-lg transition-all">
                            <Edit2 size={12} /> Edit
                          </Link>
                          <button onClick={() => handleDelete(project._id, title)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold rounded-lg transition-all">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function QuickToggle({ active, label, activeColor, inactiveColor, icon, loading, onClick }: {
  active: boolean; label: string; activeColor: string; inactiveColor: string;
  icon: React.ReactNode; loading: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-60 ${active ? activeColor : inactiveColor}`}>
      {loading ? <LoadingSpinner size="sm" /> : icon}
      {label}
    </button>
  );
}
