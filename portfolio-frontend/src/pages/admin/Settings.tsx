import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getSettings, updateSettings, updateToggles } from '@/lib/api';
import { Button, InputField, TextareaField, Card, LoadingSpinner } from '@/components/admin/AdminUI';
import { applyTheme, type ThemeColors } from '@/context/SettingsContext';
import { DEFAULT_SECTIONS } from '@/pages/Home';
import {
  Save, Settings as SettingsIcon, Zap, Globe, BarChart3,
  Palette, Check, GripVertical, Eye, EyeOff, Lock,
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

/* Section type from Home defaults */
type SectionLayout = typeof DEFAULT_SECTIONS[number] & { order: number };

export default function SettingsAdminPage() {
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [toggles, setToggles]         = useState<Record<string, boolean>>({});
  const [meta, setMeta]               = useState({ siteName: '', metaTitle: '', metaDescription: '', gaId: '' });
  const [theme, setTheme]             = useState<ThemeColors>(DEFAULT_THEME);
  const [layout, setLayout]           = useState<SectionLayout[]>([]);
  const [toast, setToast]             = useState('');
  const [settingsData, setSettingsData] = useState<any>(null);

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

      /* merge saved layout with defaults */
      const savedSections: any[] = data.metadata?.pageLayout?.sections ?? [];
      const savedMap = Object.fromEntries(savedSections.map((s: any) => [s.id, s]));
      const merged = DEFAULT_SECTIONS
        .map((def, i) => ({ ...def, ...(savedMap[def.id] ?? {}), order: savedMap[def.id]?.order ?? i }))
        .sort((a, b) => a.order - b.order) as SectionLayout[];
      setLayout(merged);

      setLoading(false);
    });
  }, []);

  /* ── helpers ── */
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

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
      await updateSettings({ ...settingsData, metadata: { ...(settingsData?.metadata || {}), theme } });
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
      /* hero is always index 0 — prevent moving anything above it */
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
      /* hero must always be order 0 and visible */
      const normalized = layout.map((s, i) => ({
        id: s.id, label: s.label, visible: s.locked ? true : s.visible, order: i, locked: s.locked,
      }));
      await updateSettings({
        ...settingsData,
        metadata: { ...(settingsData?.metadata || {}), pageLayout: { sections: normalized } },
      });
      setSettingsData((prev: any) => ({ ...prev, metadata: { ...(prev?.metadata || {}), pageLayout: { sections: normalized } } }));
      showToast('Page layout saved! The homepage now reflects your order.');
    } catch { showToast('Failed to save layout.'); }
    finally { setSavingLayout(false); }
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
                    {/* grip / lock */}
                    <div className={`shrink-0 ${isHero ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing hover:text-slate-700 dark:hover:text-white'}`}>
                      {isHero ? <Lock size={15} /> : <GripVertical size={18} />}
                    </div>

                    {/* order badge */}
                    <span className="w-6 text-xs font-mono text-slate-400 shrink-0 text-center">
                      {layout.indexOf(section) + 1}
                    </span>

                    {/* label */}
                    <span className={`flex-1 font-bold text-sm ${section.visible || isHero ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600 line-through'}`}>
                      {section.label}
                    </span>

                    {isHero && <span className="text-xs text-slate-400 font-medium">Always visible</span>}

                    {/* visibility toggle */}
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
              <p className="text-xs text-slate-500">Drag rows to reorder. Eye icon shows/hides each section on the homepage.</p>
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
                      bgDark: preset.bgDark,
                      bgLight: preset.bgLight,
                      glowPrimary: preset.glowPrimary,
                      glowAccent: preset.glowAccent,
                      glowPrimaryDark: preset.glowPrimaryDark,
                      glowAccentDark: preset.glowAccentDark,
                    };
                    setTheme(next);
                    applyTheme(next);
                  };
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={applyGradientPreset}
                      className={`group flex flex-col gap-2 p-2 rounded-xl border-2 transition-all text-left ${active ? 'border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                    >
                      {/* gradient preview: top half dark, bottom half light */}
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
              {/* Fine-tune glow strength */}
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

            {/* preview */}
            <div className="mt-6 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Live Preview</p>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: theme.primary }}>Primary Button</button>
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: theme.accent }}>Accent</button>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: theme.brand }}>Brand</span>
                <span className="text-sm font-bold" style={{ color: theme.primary }}>Primary text</span>
                <div className="flex gap-1">
                  {[theme.primary, theme.primaryDark, theme.accent, theme.brand].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg" style={{ background: c }} />
                  ))}
                </div>
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
