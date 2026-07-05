import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getSettings, updateSettings, updateToggles, exportAll, importAll } from '@/lib/api';
import { Button, InputField, TextareaField, Card, LoadingSpinner } from '@/components/admin/AdminUI';
import { applyTheme, type ThemeColors } from '@/context/SettingsContext';
import { DEFAULT_SECTIONS } from '@/pages/Home';
import {
  Save, Settings as SettingsIcon, Zap, Globe, BarChart3,
  Palette, Check, GripVertical, Eye, EyeOff, Lock,
  Download, Upload, Plus, Trash2, X, Edit3, FileJson,
} from 'lucide-react';

/* ── Preset themes ──────────────────────────────────── */
const PRESETS: { name: string; colors: ThemeColors }[] = [
  { name: 'Violet',  colors: { primary: '#7c3aed', primaryDark: '#6d28d9', accent: '#f59e0b', brand: '#c6613f', bgLight: '#fafafa', bgDark: '#09090b' } },
  { name: 'Ocean',   colors: { primary: '#2563eb', primaryDark: '#1d4ed8', accent: '#06b6d4', brand: '#0891b2', bgLight: '#f8faff', bgDark: '#050d1a' } },
  { name: 'Forest',  colors: { primary: '#16a34a', primaryDark: '#15803d', accent: '#eab308', brand: '#84cc16', bgLight: '#f8faf8', bgDark: '#05100a' } },
  { name: 'Rose',    colors: { primary: '#e11d48', primaryDark: '#be123c', accent: '#f97316', brand: '#ec4899', bgLight: '#fff8f8', bgDark: '#130508' } },
  { name: 'Indigo',  colors: { primary: '#4f46e5', primaryDark: '#4338ca', accent: '#ec4899', brand: '#8b5cf6', bgLight: '#f8f8ff', bgDark: '#08060f' } },
  { name: 'Slate',   colors: { primary: '#475569', primaryDark: '#334155', accent: '#0ea5e9', brand: '#64748b', bgLight: '#f8fafc', bgDark: '#080c10' } },
];

const DEFAULT_THEME: ThemeColors = PRESETS[0].colors;

/* ── Gradient palettes ──────────────────────────────── */
interface GradientPreset {
  id: string; name: string; desc: string;
  bgDark: string; bgLight: string;
  glowPrimaryDark: number; glowAccentDark: number;
  glowPrimary: number; glowAccent: number;
}
const GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'midnight',   name: 'Midnight',   desc: 'Deep black, balanced glow',       bgDark: '#09090b', bgLight: '#fafafa', glowPrimary: 0.12, glowAccent: 0.07, glowPrimaryDark: 0.22, glowAccentDark: 0.13 },
  { id: 'void',       name: 'Void',       desc: 'Pure black, intense glow',         bgDark: '#030303', bgLight: '#fafafa', glowPrimary: 0.10, glowAccent: 0.07, glowPrimaryDark: 0.32, glowAccentDark: 0.18 },
  { id: 'deep-space', name: 'Deep Space', desc: 'Dark blue tint, vivid glow',       bgDark: '#05080f', bgLight: '#f0f5ff', glowPrimary: 0.10, glowAccent: 0.06, glowPrimaryDark: 0.28, glowAccentDark: 0.16 },
  { id: 'obsidian',   name: 'Obsidian',   desc: 'Warm dark, subtle glow',           bgDark: '#0a0a08', bgLight: '#fdfdf8', glowPrimary: 0.10, glowAccent: 0.06, glowPrimaryDark: 0.18, glowAccentDark: 0.10 },
  { id: 'ember',      name: 'Ember',      desc: 'Warm dark, fiery highlights',       bgDark: '#0f0a08', bgLight: '#fff8f5', glowPrimary: 0.14, glowAccent: 0.10, glowPrimaryDark: 0.26, glowAccentDark: 0.18 },
  { id: 'aurora',     name: 'Aurora',     desc: 'Cool teal-dark, dreamy glow',      bgDark: '#080f0a', bgLight: '#f5fff8', glowPrimary: 0.10, glowAccent: 0.08, glowPrimaryDark: 0.24, glowAccentDark: 0.18 },
  { id: 'frost',      name: 'Frost',      desc: 'Blue-dark, crisp minimal glow',    bgDark: '#08080f', bgLight: '#f8f8ff', glowPrimary: 0.08, glowAccent: 0.05, glowPrimaryDark: 0.20, glowAccentDark: 0.12 },
  { id: 'sunset',     name: 'Sunset',     desc: 'Red-dark, dramatic warm glow',     bgDark: '#0f0808', bgLight: '#fff5f0', glowPrimary: 0.16, glowAccent: 0.12, glowPrimaryDark: 0.30, glowAccentDark: 0.20 },
];

function hexToRgbParts(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '0, 0, 0';
  return `${r}, ${g}, ${b}`;
}

type SectionLayout = typeof DEFAULT_SECTIONS[number] & { order: number };

const EMPTY_SECTION_FORM = { title: '', subtitle: '', content: '' };

export default function SettingsAdminPage() {
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [savingCustom, setSavingCustom] = useState(false);
  const [toggles, setToggles]         = useState<Record<string, boolean>>({});
  const [meta, setMeta]               = useState({ siteName: '', metaTitle: '', metaDescription: '', gaId: '' });
  const [theme, setTheme]             = useState<ThemeColors>(DEFAULT_THEME);
  const [layout, setLayout]           = useState<SectionLayout[]>([]);
  const [toast, setToast]             = useState('');
  const [settingsData, setSettingsData] = useState<any>(null);

  // Custom sections
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION_FORM);

  // Export / Import
  const importAllRef = useRef<HTMLInputElement>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [importingAll, setImportingAll] = useState(false);
  const [importResult, setImportResult] = useState('');

  /* drag refs */
  const dragId   = useRef<string | null>(null);
  const dragOver = useRef<string | null>(null);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [dragOverId,   setDragOverId]   = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(data => {
      setSettingsData(data);
      setToggles(data.featureToggles || {});
      setMeta({ siteName: data.siteName || '', metaTitle: data.metaTitle || '', metaDescription: data.metaDescription || '', gaId: data.gaId || '' });
      const savedTheme = data.metadata?.theme;
      if (savedTheme) setTheme({ ...DEFAULT_THEME, ...savedTheme });

      const savedSections: any[] = data.metadata?.pageLayout?.sections ?? [];
      const savedMap = Object.fromEntries(savedSections.map((s: any) => [s.id, s]));
      const savedCustom: any[] = data.metadata?.customSections ?? [];
      setCustomSections(savedCustom);

      // Custom section layout entries (if they exist in the saved layout)
      const customLayoutDefs = savedCustom.map((cs: any) => {
        const inLayout = savedMap[cs.id];
        return {
          id: cs.id, label: cs.title, visible: inLayout?.visible ?? true, locked: false,
          order: inLayout?.order ?? DEFAULT_SECTIONS.length,
        } as SectionLayout;
      });

      const allDefs = [...DEFAULT_SECTIONS, ...customLayoutDefs];
      const merged = allDefs
        .map((def, i) => ({ ...def, ...(savedMap[def.id] ?? {}), order: savedMap[def.id]?.order ?? i }))
        .sort((a, b) => a.order - b.order) as SectionLayout[];
      setLayout(merged);

      setLoading(false);
    });
  }, []);

  /* ── helpers ── */
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleToggle = async (key: string, value: boolean) => {
    const next = { ...toggles, [key]: value };
    setToggles(next);
    try { await updateToggles(next); } catch { alert('Toggle update failed'); }
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await updateSettings(meta); showToast('Site settings saved!'); }
    catch { alert('Error saving settings'); }
    finally { setSaving(false); }
  };

  /* ── theme ── */
  const applyPreset = (colors: ThemeColors) => { setTheme(colors); applyTheme(colors); };
  const handleColorChange = (key: keyof ThemeColors, hex: string) => {
    const next = { ...theme, [key]: hex }; setTheme(next); applyTheme(next);
  };
  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      const updated = { ...settingsData, metadata: { ...(settingsData?.metadata || {}), theme } };
      await updateSettings(updated);
      setSettingsData(updated);
      showToast('Theme saved! All visitors will see the new colors.');
    } catch { showToast('Failed to save theme.'); }
    finally { setSavingTheme(false); }
  };

  /* ── layout drag ── */
  const onDragStart = (e: React.DragEvent, id: string) => {
    dragId.current = id; setDragActiveId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragId.current) { dragOver.current = id; setDragOverId(id); }
  };
  const onDragEnd = () => {
    const src  = dragId.current;
    const dest = dragOver.current;
    dragId.current = null; dragOver.current = null;
    setDragActiveId(null); setDragOverId(null);
    if (!src || !dest || src === dest) return;

    setLayout(prev => {
      const list = [...prev];
      const si = list.findIndex(s => s.id === src);
      const di = list.findIndex(s => s.id === dest);
      if (si === -1 || di === -1) return prev;
      const [moved] = list.splice(si, 1);
      list.splice(di, 0, moved);
      return list.map((s, i) => ({ ...s, order: i }));
    });
  };

  const toggleVisibility = (id: string) => {
    setLayout(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleSaveLayout = async () => {
    setSavingLayout(true);
    try {
      const normalized = layout.map((s, i) => ({
        id: s.id, label: s.label, visible: s.locked ? true : s.visible, order: i, locked: s.locked ?? false,
      }));
      const updated = {
        ...settingsData,
        metadata: {
          ...(settingsData?.metadata || {}),
          pageLayout: { sections: normalized },
          customSections,
        },
      };
      await updateSettings(updated);
      setSettingsData(updated);
      showToast('Page layout saved!');
    } catch { showToast('Failed to save layout.'); }
    finally { setSavingLayout(false); }
  };

  /* ── custom sections ── */
  const persistCustomAndLayout = async (nextCustom: any[], nextLayout: SectionLayout[]) => {
    const normalized = nextLayout.map((s, i) => ({
      id: s.id, label: s.label, visible: s.locked ? true : s.visible, order: i, locked: s.locked ?? false,
    }));
    const updated = {
      ...settingsData,
      metadata: {
        ...(settingsData?.metadata || {}),
        pageLayout: { sections: normalized },
        customSections: nextCustom,
      },
    };
    await updateSettings(updated);
    setSettingsData(updated);
  };

  const handleAddCustomSection = async () => {
    if (!sectionForm.title.trim()) return;
    setSavingCustom(true);
    try {
      const id = `custom_${Date.now()}`;
      const cs = { id, title: sectionForm.title.trim(), subtitle: sectionForm.subtitle.trim(), content: sectionForm.content };
      const nextCustom = [...customSections, cs];
      const newEntry: SectionLayout = { id, label: cs.title, visible: true, locked: false, order: layout.length };
      const nextLayout = [...layout, newEntry];
      setCustomSections(nextCustom);
      setLayout(nextLayout);
      setShowAddSection(false);
      setSectionForm(EMPTY_SECTION_FORM);
      await persistCustomAndLayout(nextCustom, nextLayout);
      showToast('Custom section added!');
    } catch { showToast('Failed to save section.'); }
    finally { setSavingCustom(false); }
  };

  const handleUpdateCustomSection = async () => {
    if (!editingSection || !sectionForm.title.trim()) return;
    setSavingCustom(true);
    try {
      const nextCustom = customSections.map(cs =>
        cs.id === editingSection.id
          ? { ...cs, title: sectionForm.title.trim(), subtitle: sectionForm.subtitle.trim(), content: sectionForm.content }
          : cs
      );
      const nextLayout = layout.map(s =>
        s.id === editingSection.id ? { ...s, label: sectionForm.title.trim() } : s
      );
      setCustomSections(nextCustom);
      setLayout(nextLayout);
      setEditingSection(null);
      setSectionForm(EMPTY_SECTION_FORM);
      await persistCustomAndLayout(nextCustom, nextLayout);
      showToast('Section updated!');
    } catch { showToast('Failed to update section.'); }
    finally { setSavingCustom(false); }
  };

  const handleDeleteCustomSection = async (id: string) => {
    if (!confirm('Delete this custom section? This cannot be undone.')) return;
    setSavingCustom(true);
    try {
      const nextCustom = customSections.filter(cs => cs.id !== id);
      const nextLayout = layout.filter(s => s.id !== id);
      setCustomSections(nextCustom);
      setLayout(nextLayout);
      await persistCustomAndLayout(nextCustom, nextLayout);
      showToast('Section deleted.');
    } catch { showToast('Failed to delete section.'); }
    finally { setSavingCustom(false); }
  };

  const openEdit = (cs: any) => {
    setEditingSection(cs);
    setSectionForm({ title: cs.title, subtitle: cs.subtitle || '', content: cs.content || '' });
    setShowAddSection(false);
  };

  /* ── export / import ── */
  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const data = await exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export downloaded!');
    } catch { showToast('Export failed.'); }
    finally { setExportingAll(false); }
  };

  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportingAll(true);
    setImportResult('');
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = await importAll(json);
      const parts = Object.entries(result).map(([k, v]) => `${k}: ${v}`);
      setImportResult(`Done — ${parts.join(' · ')}`);
      showToast('Import complete! Refresh admin pages to see updated data.');
    } catch (err: any) {
      setImportResult(`Failed: ${err?.response?.data?.message || err.message}`);
    } finally {
      setImportingAll(false);
      if (importAllRef.current) importAllRef.current.value = '';
    }
  };

  if (loading) return (
    <AdminLayout title="Settings" subtitle="Configure your portfolio">
      <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Settings" subtitle="Manage global settings, theme, and feature toggles">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm shadow-xl flex items-center gap-2">
          <Check size={16} /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ── Page Layout ── */}
          <Card title="Page Layout" subtitle="Drag to reorder sections · toggle to show or hide" icon={<SettingsIcon size={20} />}>
            <div className="space-y-2">
              {layout.map(section => {
                const isDragging = dragActiveId === section.id;
                const isOver     = dragOverId   === section.id && !isDragging;
                const isHero     = section.locked;
                const isCustom   = section.id.startsWith('custom_');

                return (
                  <div
                    key={section.id}
                    draggable={!isHero}
                    onDragStart={e => !isHero && onDragStart(e, section.id)}
                    onDragOver={e  => !isHero && onDragOver(e, section.id)}
                    onDragEnd={onDragEnd}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all select-none
                      ${isDragging ? 'opacity-40 scale-[0.98] border-primary/50 bg-primary/5' : ''}
                      ${isOver    ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}
                      ${isHero    ? 'opacity-80' : ''}
                    `}
                  >
                    <div className={`shrink-0 ${isHero ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing hover:text-slate-700 dark:hover:text-white'}`}>
                      {isHero ? <Lock size={15} /> : <GripVertical size={18} />}
                    </div>

                    <span className="w-6 text-xs font-mono text-slate-400 shrink-0 text-center">
                      {layout.indexOf(section) + 1}
                    </span>

                    <span className={`flex-1 font-bold text-sm ${section.visible || isHero ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 line-through'}`}>
                      {section.label}
                      {isCustom && <span className="ml-2 text-xs font-normal text-primary/70 border border-primary/30 rounded px-1.5 py-0.5">custom</span>}
                    </span>

                    {isHero && <span className="text-xs text-slate-400 font-medium">Always visible</span>}

                    {!isHero && (
                      <button type="button" onClick={() => toggleVisibility(section.id)}
                        className={`p-2 rounded-lg transition-all ${section.visible ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200' : 'text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        title={section.visible ? 'Click to hide' : 'Click to show'}>
                        {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="button" onClick={handleSaveLayout} disabled={savingLayout}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/25">
                <Save size={15} /> {savingLayout ? 'Saving…' : 'Save Layout'}
              </button>
              <p className="text-xs text-slate-500">Drag rows to reorder. Eye icon shows/hides each section.</p>
            </div>
          </Card>

          {/* ── Custom Sections ── */}
          <Card title="Custom Sections" subtitle="Add extra content sections to your homepage" icon={<Plus size={20} />}>
            {customSections.length === 0 && !showAddSection && !editingSection && (
              <p className="text-sm text-slate-500 mb-4">No custom sections yet. Add one below — it will appear in Page Layout and on your homepage.</p>
            )}

            <div className="space-y-3 mb-4">
              {customSections.map(cs => (
                <div key={cs.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{cs.title}</div>
                    {cs.subtitle && <div className="text-xs text-slate-500 mt-0.5">{cs.subtitle}</div>}
                    {cs.content && (
                      <div className="text-xs text-slate-400 mt-1 truncate max-w-md">{cs.content.slice(0, 120)}{cs.content.length > 120 ? '…' : ''}</div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button type="button" onClick={() => openEdit(cs)}
                      className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit3 size={15} />
                    </button>
                    <button type="button" onClick={() => handleDeleteCustomSection(cs.id)}
                      disabled={savingCustom}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inline form: add or edit */}
            {(showAddSection || editingSection) && (
              <div className="border-2 border-primary/30 rounded-xl p-5 bg-primary/5 space-y-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingSection ? 'Edit Section' : 'New Section'}
                  </h4>
                  <button type="button" onClick={() => { setShowAddSection(false); setEditingSection(null); setSectionForm(EMPTY_SECTION_FORM); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={16} />
                  </button>
                </div>
                <InputField
                  label="Section Title"
                  name="title"
                  value={sectionForm.title}
                  onChange={e => setSectionForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Open Source, Hobbies, Talks, etc."
                />
                <InputField
                  label="Subtitle (optional)"
                  name="subtitle"
                  value={sectionForm.subtitle}
                  onChange={e => setSectionForm(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="A short tagline under the title"
                />
                <TextareaField
                  label="Content"
                  name="content"
                  value={sectionForm.content}
                  onChange={e => setSectionForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Write your content here. Paragraphs separated by blank lines."
                  rows={6}
                />
                <div className="flex gap-3">
                  <button type="button"
                    onClick={editingSection ? handleUpdateCustomSection : handleAddCustomSection}
                    disabled={savingCustom || !sectionForm.title.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition-all disabled:opacity-60">
                    <Save size={14} /> {savingCustom ? 'Saving…' : editingSection ? 'Update' : 'Add Section'}
                  </button>
                  <button type="button"
                    onClick={() => { setShowAddSection(false); setEditingSection(null); setSectionForm(EMPTY_SECTION_FORM); }}
                    className="px-5 py-2.5 font-bold rounded-xl text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!showAddSection && !editingSection && (
              <button type="button" onClick={() => setShowAddSection(true)}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-primary hover:text-primary font-bold text-sm rounded-xl transition-all w-full justify-center">
                <Plus size={16} /> Add Custom Section
              </button>
            )}
          </Card>

          {/* ── Export / Import ── */}
          <Card title="Data Export / Import" subtitle="Transfer all data between local dev and production" icon={<FileJson size={20} />}>
            <div className="flex flex-wrap gap-3 mb-4">
              <button type="button" onClick={handleExportAll} disabled={exportingAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-60 shadow-md">
                <Download size={15} /> {exportingAll ? 'Exporting…' : 'Export All Data'}
              </button>
              <button type="button" onClick={() => importAllRef.current?.click()} disabled={importingAll}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:border-primary hover:text-primary transition-all disabled:opacity-60">
                <Upload size={15} /> {importingAll ? 'Importing…' : 'Import All Data'}
              </button>
              <input ref={importAllRef} type="file" accept=".json" className="hidden" onChange={handleImportAll} />
            </div>

            {importResult && (
              <div className={`text-sm font-medium px-4 py-3 rounded-xl mb-4 ${importResult.startsWith('Failed') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                {importResult}
              </div>
            )}

            <div className="text-xs text-slate-500 space-y-1">
              <p><strong>Export</strong> downloads Profile, Skills, Experience, Projects, Certifications &amp; Settings as one JSON file.</p>
              <p><strong>Import</strong> upserts all data. Images (avatars, project images) are excluded — upload them separately via the admin panel.</p>
            </div>
          </Card>

          {/* ── Theme Colors ── */}
          <Card title="Theme Colors" subtitle="Customize your portfolio's color palette" icon={<Palette size={20} />}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Preset Themes</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESETS.map(preset => {
                  const active = preset.colors.primary === theme.primary;
                  return (
                    <button key={preset.name} type="button" onClick={() => applyPreset(preset.colors)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${active ? 'border-slate-900 dark:border-white shadow-md' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      <div className="flex gap-0.5">
                        <div className="w-5 h-8 rounded-l-lg" style={{ background: preset.colors.primary }} />
                        <div className="w-5 h-8 rounded-r-lg" style={{ background: preset.colors.accent }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{preset.name}</span>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Custom Colors</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([
                  { key: 'primary'     as const, label: 'Primary' },
                  { key: 'primaryDark' as const, label: 'Primary Dark' },
                  { key: 'accent'      as const, label: 'Accent' },
                  { key: 'brand'       as const, label: 'Brand' },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={theme[key]}
                        onChange={e => handleColorChange(key, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5" />
                      <input type="text" value={theme[key]}
                        onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) handleColorChange(key, e.target.value); }}
                        className="flex-1 px-2 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Background Gradient Palette</p>
              <p className="text-xs text-slate-400 mb-4">Choose a background mood. Preview uses your current primary &amp; accent colors.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GRADIENT_PRESETS.map(preset => {
                  const active = (theme.bgDark ?? '#09090b') === preset.bgDark && (theme.bgLight ?? '#fafafa') === preset.bgLight;
                  const darkGradient = `
                    radial-gradient(ellipse 180% 100% at -15% -20%, rgba(${hexToRgbParts(theme.primary)}, ${preset.glowPrimaryDark}) 0%, transparent 58%),
                    radial-gradient(ellipse 120% 90% at 115% 112%, rgba(${hexToRgbParts(theme.accent)}, ${preset.glowAccentDark}) 0%, transparent 58%),
                    ${preset.bgDark}
                  `;
                  const lightGradient = `
                    radial-gradient(ellipse 180% 100% at -15% -20%, rgba(${hexToRgbParts(theme.primary)}, ${preset.glowPrimary}) 0%, transparent 58%),
                    radial-gradient(ellipse 120% 90% at 115% 112%, rgba(${hexToRgbParts(theme.accent)}, ${preset.glowAccent}) 0%, transparent 58%),
                    ${preset.bgLight}
                  `;
                  const applyGradientPreset = () => {
                    const next: ThemeColors = {
                      ...theme,
                      bgDark: preset.bgDark, bgLight: preset.bgLight,
                      glowPrimary: preset.glowPrimary, glowAccent: preset.glowAccent,
                      glowPrimaryDark: preset.glowPrimaryDark, glowAccentDark: preset.glowAccentDark,
                    };
                    setTheme(next); applyTheme(next);
                  };
                  return (
                    <button key={preset.id} type="button" onClick={applyGradientPreset}
                      className={`group flex flex-col gap-2 p-2 rounded-xl border-2 transition-all text-left ${active ? 'border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                      <div className="w-full h-16 rounded-lg overflow-hidden flex flex-col">
                        <div className="flex-1" style={{ background: darkGradient }} />
                        <div className="flex-1" style={{ background: lightGradient }} />
                      </div>
                      <div className="px-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{preset.name}</span>
                          {active && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{preset.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Dark Glow — Primary <span className="text-slate-400 font-mono">{((theme.glowPrimaryDark ?? 0.22) * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0" max="0.5" step="0.01"
                    value={theme.glowPrimaryDark ?? 0.22}
                    onChange={e => { const next = { ...theme, glowPrimaryDark: parseFloat(e.target.value) }; setTheme(next); applyTheme(next); }}
                    className="w-full accent-primary h-2 rounded-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Dark Glow — Accent <span className="text-slate-400 font-mono">{((theme.glowAccentDark ?? 0.13) * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0" max="0.4" step="0.01"
                    value={theme.glowAccentDark ?? 0.13}
                    onChange={e => { const next = { ...theme, glowAccentDark: parseFloat(e.target.value) }; setTheme(next); applyTheme(next); }}
                    className="w-full accent-primary h-2 rounded-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Light Glow — Primary <span className="text-slate-400 font-mono">{((theme.glowPrimary ?? 0.12) * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0" max="0.3" step="0.01"
                    value={theme.glowPrimary ?? 0.12}
                    onChange={e => { const next = { ...theme, glowPrimary: parseFloat(e.target.value) }; setTheme(next); applyTheme(next); }}
                    className="w-full accent-primary h-2 rounded-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Light Glow — Accent <span className="text-slate-400 font-mono">{((theme.glowAccent ?? 0.07) * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0" max="0.25" step="0.01"
                    value={theme.glowAccent ?? 0.07}
                    onChange={e => { const next = { ...theme, glowAccent: parseFloat(e.target.value) }; setTheme(next); applyTheme(next); }}
                    className="w-full accent-primary h-2 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Live Preview</p>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: theme.primary }}>Primary Button</button>
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: theme.accent }}>Accent</button>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: theme.brand }}>Brand</span>
                <span className="text-sm font-bold" style={{ color: theme.primary }}>Primary text</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-xl overflow-hidden border border-slate-700 h-16" style={{
                  background: `radial-gradient(ellipse 180% 100% at -15% -20%, rgba(${hexToRgbParts(theme.primary)}, ${theme.glowPrimaryDark ?? 0.22}) 0%, transparent 58%), radial-gradient(ellipse 120% 90% at 115% 112%, rgba(${hexToRgbParts(theme.accent)}, ${theme.glowAccentDark ?? 0.13}) 0%, transparent 58%), ${theme.bgDark ?? '#09090b'}`
                }}>
                  <div className="p-2"><span className="text-[10px] text-white/60 font-bold">Dark Mode</span></div>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-300 h-16" style={{
                  background: `radial-gradient(ellipse 180% 100% at -15% -20%, rgba(${hexToRgbParts(theme.primary)}, ${theme.glowPrimary ?? 0.12}) 0%, transparent 58%), radial-gradient(ellipse 120% 90% at 115% 112%, rgba(${hexToRgbParts(theme.accent)}, ${theme.glowAccent ?? 0.07}) 0%, transparent 58%), ${theme.bgLight ?? '#fafafa'}`
                }}>
                  <div className="p-2"><span className="text-[10px] text-black/40 font-bold">Light Mode</span></div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button type="button" onClick={handleSaveTheme} disabled={savingTheme}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/25">
                <Save size={15} /> {savingTheme ? 'Saving…' : 'Save Theme'}
              </button>
              <p className="text-xs text-slate-500">Colors preview instantly. Click Save to persist for all visitors.</p>
            </div>
          </Card>

          {/* ── SEO ── */}
          <Card title="SEO & Metadata" subtitle="Search engine optimization settings" icon={<Globe size={20} />}>
            <form onSubmit={handleSaveMeta} className="space-y-6">
              <InputField label="Site Name" name="siteName" value={meta.siteName}
                onChange={e => setMeta({ ...meta, siteName: e.target.value })} placeholder="My Portfolio" icon={<Globe size={18} />} />
              <InputField label="Meta Title" name="metaTitle" value={meta.metaTitle}
                onChange={e => setMeta({ ...meta, metaTitle: e.target.value })} placeholder="Portfolio - Full Stack Developer" icon={<SettingsIcon size={18} />} />
              <TextareaField label="Meta Description" name="metaDescription" value={meta.metaDescription}
                onChange={e => setMeta({ ...meta, metaDescription: e.target.value })} placeholder="Professional portfolio showcasing my work and skills..." rows={3} />
              <InputField label="Google Analytics ID" name="gaId" value={meta.gaId}
                onChange={e => setMeta({ ...meta, gaId: e.target.value })} placeholder="G-XXXXXXXXXX" icon={<BarChart3 size={18} />} />
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="primary" size="lg" disabled={saving} icon={<Save size={18} />}>
                  {saving ? 'Saving…' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* ── sidebar ── */}
        <div className="space-y-8">
          <Card title="Feature Toggles" subtitle="Show / hide sections" icon={<Zap size={20} />}>
            <div className="space-y-3">
              {[
                { key: 'showProjects',      label: 'Projects',       desc: 'Display projects section' },
                { key: 'showSkills',        label: 'Skills',         desc: 'Display skills section' },
                { key: 'showExperience',    label: 'Experience',     desc: 'Display work experience' },
                { key: 'showCertifications',label: 'Certifications', desc: 'Display certifications' },
                { key: 'showContactForm',   label: 'Contact Form',   desc: 'Display contact form' },
                { key: 'enableBlog',        label: 'Blog',           desc: 'Enable blog feature' },
              ].map(({ key, label, desc }) => (
                <FeatureToggle key={key} label={label} description={desc}
                  active={toggles[key]} onChange={v => handleToggle(key, v)} />
              ))}
            </div>
          </Card>

          <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Live Updates
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Feature toggle and layout changes take effect immediately. Theme changes require saving.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function FeatureToggle({ label, description, active, onChange }: {
  label: string; description: string; active: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
      <div>
        <div className="font-bold text-sm text-slate-900 dark:text-white">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <button onClick={() => onChange(!active)}
        className={`relative w-12 h-6 rounded-full transition-all shrink-0 ml-4 ${active ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${active ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
