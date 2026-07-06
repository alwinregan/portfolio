import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button, InputField, TextareaField, LoadingSpinner } from '@/components/admin/AdminUI';
import {
  getAdminProjects, createProject, updateProject, uploadImage,
} from '@/lib/api';
import {
  ArrowLeft, Save, Eye, EyeOff, Star, Activity,
  Globe, Github, Download, Image as ImageIcon,
  Upload, Trash2, Plus, X, ChevronDown, ChevronUp,
  Layers, FileText, Link as LinkIcon, Settings2, BookOpen, Zap,
} from 'lucide-react';

/* ── helpers ──────────────────────────────────────── */
const tv = (v: any) => (typeof v === 'object' && v !== null ? v.en ?? '' : v ?? '');

const SECTION_TYPES = ['problem', 'solution', 'challenges', 'stack', 'impact'] as const;

const emptyCs = () => ({
  enabled: false,
  subtitle: '',
  tagline: '',
  developer: 'Sole Developer & Designer',
  stackHighlight: '',
  problem:    { title: 'The Problem',          number: '01', lead: '', body: '', items: [] as CsItem[] },
  solution:   { title: 'The Solution',         number: '02', lead: '', body: '', items: [] as CsItem[] },
  challenges: { title: 'Engineering Challenges', number: '03', lead: '', body: '', items: [] as CsChallenge[] },
  stack:      { title: 'Tech Stack',           number: '04', lead: '', categories: [] as CsCategory[] },
  impact:     { title: 'Scope & Impact',       number: '05', lead: '', stats: [] as CsStat[], highlights: [] as CsItem[] },
});

type CsItem      = { emoji: string; title: string; body: string };
type CsChallenge = { constraint: string; constraintBody: string; codeBefore: string; resolution: string; resolutionBody: string; codeAfter: string };
type CsCategory  = { name: string; items: string[] };
type CsStat      = { value: string; label: string };

function csFromProject(p: any) {
  const cs = p?.caseStudy;
  if (!cs) return emptyCs();
  const find = (type: string) => cs.sections?.find((s: any) => s.type === type) ?? {};
  const prob = find('problem');
  const sol  = find('solution');
  const eng  = find('challenges');
  const stk  = find('stack');
  const imp  = find('impact');
  return {
    enabled: true,
    subtitle: cs.subtitle ?? '',
    tagline:  cs.tagline ?? '',
    developer: cs.meta?.developer ?? 'Sole Developer & Designer',
    stackHighlight: cs.meta?.stackHighlight?.join(', ') ?? '',
    problem:    { title: prob.title ?? 'The Problem',            number: prob.number ?? '01', lead: prob.lead ?? '', body: prob.body ?? '', items: prob.items ?? [] },
    solution:   { title: sol.title  ?? 'The Solution',           number: sol.number  ?? '02', lead: sol.lead  ?? '', body: sol.body  ?? '', items: sol.items  ?? [] },
    challenges: { title: eng.title  ?? 'Engineering Challenges', number: eng.number  ?? '03', lead: eng.lead  ?? '', body: eng.body  ?? '', items: eng.items  ?? [] },
    stack:      { title: stk.title  ?? 'Tech Stack',             number: stk.number  ?? '04', lead: stk.lead  ?? '', categories: stk.categories ?? [] },
    impact:     { title: imp.title  ?? 'Scope & Impact',         number: imp.number  ?? '05', lead: imp.lead  ?? '', stats: imp.stats ?? [], highlights: imp.highlights ?? [] },
  };
}

function csToPayload(cs: ReturnType<typeof emptyCs>) {
  if (!cs.enabled) return null;
  return {
    subtitle: cs.subtitle,
    tagline:  cs.tagline,
    meta: {
      developer: cs.developer,
      stackHighlight: cs.stackHighlight.split(',').map(s => s.trim()).filter(Boolean),
    },
    sections: [
      { id: 'problem',    type: 'problem',    number: cs.problem.number,    title: cs.problem.title,    lead: cs.problem.lead,    body: cs.problem.body,    items: cs.problem.items },
      { id: 'solution',   type: 'solution',   number: cs.solution.number,   title: cs.solution.title,   lead: cs.solution.lead,   body: cs.solution.body,   items: cs.solution.items },
      { id: 'engineering',type: 'challenges', number: cs.challenges.number, title: cs.challenges.title, lead: cs.challenges.lead, body: cs.challenges.body, items: cs.challenges.items },
      { id: 'stack',      type: 'stack',      number: cs.stack.number,      title: cs.stack.title,      lead: cs.stack.lead,      categories: cs.stack.categories },
      { id: 'impact',     type: 'impact',     number: cs.impact.number,     title: cs.impact.title,     lead: cs.impact.lead,     stats: cs.impact.stats, highlights: cs.impact.highlights },
    ],
  };
}

/* ── Section nav items ────────────────────────────── */
const NAV = [
  { id: 'overview',    label: 'Overview',    icon: Layers },
  { id: 'content',     label: 'Content',     icon: FileText },
  { id: 'media',       label: 'Media',       icon: ImageIcon },
  { id: 'stack-tags',  label: 'Stack & Tags', icon: Zap },
  { id: 'links',       label: 'Links',       icon: LinkIcon },
  { id: 'visibility',  label: 'Visibility',  icon: Settings2 },
  { id: 'casestudy',   label: 'Case Study',  icon: BookOpen },
] as const;

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  /* ── form state ── */
  const [f, setF] = useState({
    title: '', description: '', longDescription: '', summary: '',
    client: '', role: '', year: new Date().getFullYear(),
    body: '', imageUrl: '', images: '',
    liveUrl: '', githubUrl: '', pdfUrl: '',
    techStack: '', tags: '',
    featured: false, published: true, isActive: true, order: 0,
    projectType: 'work' as 'work' | 'personal',
  });
  const [cs, setCs] = useState(emptyCs());

  /* ── load project ── */
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const all = await getAdminProjects();
        const p = all.find((x: any) => x._id === id);
        if (!p) { navigate('/admin/projects'); return; }
        setF({
          title: tv(p.title), description: tv(p.description),
          longDescription: tv(p.longDescription), summary: p.summary ?? '',
          client: p.client ?? '', role: p.role ?? '',
          year: p.year ?? new Date().getFullYear(),
          body: p.body ?? '', imageUrl: p.imageUrl ?? '',
          images: (p.images ?? []).join('\n'),
          liveUrl: p.liveUrl ?? '', githubUrl: p.githubUrl ?? '', pdfUrl: p.pdfUrl ?? '',
          techStack: (p.techStack ?? []).join(', '), tags: (p.tags ?? []).join(', '),
          featured: !!p.featured, published: p.published !== false,
          isActive: p.isActive !== false, order: p.order ?? 0,
          projectType: (p.projectType === 'personal' ? 'personal' : 'work') as 'work' | 'personal',
        });
        setCs(csFromProject(p));
      } finally { setLoading(false); }
    })();
  }, [id]);

  /* ── save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        title: { en: f.title }, description: { en: f.description },
        longDescription: f.longDescription ? { en: f.longDescription } : undefined,
        summary: f.summary || undefined, client: f.client || undefined,
        role: f.role || undefined, year: f.year || undefined,
        body: f.body || undefined, imageUrl: f.imageUrl || undefined,
        images: f.images.split('\n').map(s => s.trim()).filter(Boolean),
        liveUrl: f.liveUrl || undefined, githubUrl: f.githubUrl || undefined,
        pdfUrl: f.pdfUrl || undefined,
        techStack: f.techStack.split(',').map(s => s.trim()).filter(Boolean),
        tags: f.tags.split(',').map(s => s.trim()).filter(Boolean),
        featured: f.featured, published: f.published, isActive: f.isActive, order: f.order,
        projectType: f.projectType,
        caseStudy: csToPayload(cs),
      };
      if (isNew) { await createProject(payload); }
      else { await updateProject(id!, payload); }
      setToast({ msg: isNew ? 'Project created!' : 'Saved successfully!', type: 'ok' });
      if (isNew) navigate('/admin/projects');
    } catch {
      setToast({ msg: 'Save failed. Check all required fields.', type: 'err' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  /* ── image upload ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setF(p => ({ ...p, imageUrl: res.url }));
    } catch { setToast({ msg: 'Image upload failed', type: 'err' }); }
    finally { setUploading(false); }
  };

  /* ── section scroll ── */
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTo = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
  const imgSrc = (u: string) => u.startsWith('/') ? `${API_BASE}${u}` : u;

  if (loading) return (
    <AdminLayout title="Edit Project" subtitle="">
      <div className="flex items-center justify-center py-32"><LoadingSpinner size="lg" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout title={isNew ? 'New Project' : f.title || 'Edit Project'} subtitle="Edit every detail">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-xl ${toast.type === 'ok' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex gap-8 relative">
        {/* ── sticky left nav ── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            <Link to="/admin/projects" className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium mb-4 transition-colors">
              <ArrowLeft size={14} /> All Projects
            </Link>
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${activeSection === n.id ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <n.icon size={15} />
                {n.label}
              </button>
            ))}
            <div className="pt-4">
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 shadow-lg shadow-primary/25">
                <Save size={15} /> {saving ? 'Saving…' : 'Save All'}
              </button>
            </div>
          </div>
        </aside>

        {/* ── main content ── */}
        <div className="flex-1 min-w-0 space-y-8 pb-24">

          {/* mobile top bar */}
          <div className="lg:hidden flex items-center justify-between">
            <Link to="/admin/projects" className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm disabled:opacity-60">
              <Save size={14} /> {saving ? 'Saving…' : 'Save All'}
            </button>
          </div>

          {/* ── 1. Overview ── */}
          <Section id="overview" label="Overview" icon={<Layers size={18} />} ref={el => { sectionRefs.current.overview = el; }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <InputField label="Project Title *" name="title" value={f.title}
                  onChange={e => setF(p => ({ ...p, title: e.target.value }))}
                  placeholder="FitCore – Gym Management Platform" required />
              </div>
              <InputField label="Client / Company" name="client" value={f.client}
                onChange={e => setF(p => ({ ...p, client: e.target.value }))} placeholder="e.g. Abbazi Gym" />
              <InputField label="Your Role" name="role" value={f.role}
                onChange={e => setF(p => ({ ...p, role: e.target.value }))} placeholder="Sole Developer & Designer" />
              <InputField label="Year" name="year" type="number" value={f.year}
                onChange={e => setF(p => ({ ...p, year: +e.target.value }))} min="2000" max={new Date().getFullYear()} />
              <InputField label="Display Order" name="order" type="number" value={f.order}
                onChange={e => setF(p => ({ ...p, order: +e.target.value }))} min="0" />
              <div className="md:col-span-2">
                <TextareaField label="Short Description *" name="description" value={f.description} rows={2}
                  onChange={e => setF(p => ({ ...p, description: e.target.value }))}
                  placeholder="One-line description shown on project cards" required />
              </div>
              <div className="md:col-span-2">
                <TextareaField label="Summary" name="summary" value={f.summary} rows={3}
                  onChange={e => setF(p => ({ ...p, summary: e.target.value }))}
                  placeholder="Slightly longer summary for the projects list page" />
              </div>
            </div>
          </Section>

          {/* ── 2. Content ── */}
          <Section id="content" label="Content" icon={<FileText size={18} />} ref={el => { sectionRefs.current.content = el; }}>
            <TextareaField label="Long Description" name="longDescription" value={f.longDescription} rows={5}
              onChange={e => setF(p => ({ ...p, longDescription: e.target.value }))}
              placeholder="Full description shown on the project detail page. Supports bullet points starting with • or -" />
            <TextareaField label="Markdown Body" name="body" value={f.body} rows={8}
              onChange={e => setF(p => ({ ...p, body: e.target.value }))}
              placeholder="# Project Details&#10;&#10;Write detailed markdown content…" />
          </Section>

          {/* ── 3. Media ── */}
          <Section id="media" label="Media" icon={<ImageIcon size={18} />} ref={el => { sectionRefs.current.media = el; }}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-5">
              {f.imageUrl ? (
                <div className="relative group">
                  <img src={imgSrc(f.imageUrl)} alt="" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => setF(p => ({ ...p, imageUrl: '' }))}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg flex items-center gap-1.5">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3 py-14">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    {uploading ? <LoadingSpinner size="sm" /> : <Upload size={28} />}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm mb-0.5">Click to upload cover image</p>
                    <p className="text-xs text-slate-500">JPG, PNG, WEBP — max 10 MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
            <InputField label="Cover Image URL (or paste after upload)" name="imageUrl" value={f.imageUrl}
              onChange={e => setF(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://…" />
            <TextareaField label="Additional Images (one URL per line)" name="images" value={f.images} rows={4}
              onChange={e => setF(p => ({ ...p, images: e.target.value }))}
              placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png" />
          </Section>

          {/* ── 4. Stack & Tags ── */}
          <Section id="stack-tags" label="Stack & Tags" icon={<Zap size={18} />} ref={el => { sectionRefs.current['stack-tags'] = el; }}>
            <ChipInput label="Tech Stack" value={f.techStack} onChange={v => setF(p => ({ ...p, techStack: v }))}
              placeholder="React, Node.js, MongoDB…" />
            <ChipInput label="Tags" value={f.tags} onChange={v => setF(p => ({ ...p, tags: v }))}
              placeholder="SaaS, Full-Stack, Freelance…" colorClass="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
          </Section>

          {/* ── 5. Links ── */}
          <Section id="links" label="Links" icon={<LinkIcon size={18} />} ref={el => { sectionRefs.current.links = el; }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1"><Globe size={13} /> Live Demo</label>
                <input type="url" value={f.liveUrl} onChange={e => setF(p => ({ ...p, liveUrl: e.target.value }))}
                  placeholder="https://project.com" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1"><Github size={13} /> GitHub</label>
                <input type="url" value={f.githubUrl} onChange={e => setF(p => ({ ...p, githubUrl: e.target.value }))}
                  placeholder="https://github.com/user/repo" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1"><Download size={13} /> Case Study PDF URL</label>
                <input type="text" value={f.pdfUrl} onChange={e => setF(p => ({ ...p, pdfUrl: e.target.value }))}
                  placeholder="Paste PDF URL from Media Library" className={inputCls} />
              </div>
            </div>
          </Section>

          {/* ── 6. Visibility ── */}
          <Section id="visibility" label="Visibility & Settings" icon={<Settings2 size={18} />} ref={el => { sectionRefs.current.visibility = el; }}>
            {/* Project type */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Type</label>
              <div className="flex gap-3">
                {(['work', 'personal'] as const).map(type => (
                  <button key={type} type="button"
                    onClick={() => setF(p => ({ ...p, projectType: type }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${f.projectType === type ? 'bg-[#7c3aed] text-white border-[#7c3aed]' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700 hover:border-[#7c3aed]'}`}>
                    {type === 'work' ? 'Professional Work' : 'Personal / Side Project'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ToggleCard
                label="Published" desc="Visible on public site"
                icon={f.published ? <Eye size={20} /> : <EyeOff size={20} />}
                checked={f.published} color="emerald"
                onChange={v => setF(p => ({ ...p, published: v }))} />
              <ToggleCard
                label="Active" desc="Listed in project grid"
                icon={<Activity size={20} />}
                checked={f.isActive} color="blue"
                onChange={v => setF(p => ({ ...p, isActive: v }))} />
              <ToggleCard
                label="Featured" desc="Highlighted on homepage"
                icon={<Star size={20} />}
                checked={f.featured} color="amber"
                onChange={v => setF(p => ({ ...p, featured: v }))} />
            </div>
          </Section>

          {/* ── 7. Case Study ── */}
          <Section id="casestudy" label="Case Study" icon={<BookOpen size={18} />} ref={el => { sectionRefs.current.casestudy = el; }}>
            {/* master toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Enable Case Study Page</p>
                <p className="text-xs text-slate-500 mt-0.5">Unlocks the rich case study layout for this project</p>
              </div>
              <button type="button" onClick={() => setCs(p => ({ ...p, enabled: !p.enabled }))}
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${cs.enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${cs.enabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {cs.enabled && (
              <div className="space-y-6">
                {/* Meta */}
                <Accordion label="Hero Meta" defaultOpen>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Subtitle (shown below title in hero)</label>
                      <input className={inputCls} value={cs.subtitle} onChange={e => setCs(p => ({ ...p, subtitle: e.target.value }))}
                        placeholder="Full-Stack Web Application · 2025 – 2026" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tagline (hero subtext)</label>
                      <textarea className={`${inputCls} resize-none`} rows={2} value={cs.tagline} onChange={e => setCs(p => ({ ...p, tagline: e.target.value }))}
                        placeholder="A one-sentence summary of what the project does and why it matters." />
                    </div>
                    <div>
                      <label className={labelCls}>Developer Label</label>
                      <input className={inputCls} value={cs.developer} onChange={e => setCs(p => ({ ...p, developer: e.target.value }))}
                        placeholder="Sole Developer & Designer" />
                    </div>
                    <div>
                      <label className={labelCls}>Stack Highlight (comma-sep, shown in hero badges)</label>
                      <input className={inputCls} value={cs.stackHighlight} onChange={e => setCs(p => ({ ...p, stackHighlight: e.target.value }))}
                        placeholder="Laravel 13, React 19, MySQL" />
                    </div>
                  </div>
                </Accordion>

                {/* 01 Problem */}
                <Accordion label="01 — Problem Section">
                  <CsSectionHeader data={cs.problem} onChange={v => setCs(p => ({ ...p, problem: { ...p.problem, ...v } }))} />
                  <ItemsEditor
                    items={cs.problem.items}
                    onChange={items => setCs(p => ({ ...p, problem: { ...p.problem, items } }))}
                    template={{ emoji: '❌', title: '', body: '' }}
                    renderItem={(item, idx, onChange, onDel) => (
                      <EmojiCard item={item} idx={idx} onChange={onChange} onDelete={onDel} />
                    )}
                    addLabel="Add Problem Card"
                  />
                </Accordion>

                {/* 02 Solution */}
                <Accordion label="02 — Solution Section">
                  <CsSectionHeader data={cs.solution} onChange={v => setCs(p => ({ ...p, solution: { ...p.solution, ...v } }))} />
                  <ItemsEditor
                    items={cs.solution.items}
                    onChange={items => setCs(p => ({ ...p, solution: { ...p.solution, items } }))}
                    template={{ emoji: '✅', title: '', body: '' }}
                    renderItem={(item, idx, onChange, onDel) => (
                      <EmojiCard item={item} idx={idx} onChange={onChange} onDelete={onDel} />
                    )}
                    addLabel="Add Feature Card"
                  />
                </Accordion>

                {/* 03 Engineering Challenges */}
                <Accordion label="03 — Engineering Challenges">
                  <CsSectionHeader data={cs.challenges} onChange={v => setCs(p => ({ ...p, challenges: { ...p.challenges, ...v } }))} />
                  <ItemsEditor
                    items={cs.challenges.items}
                    onChange={items => setCs(p => ({ ...p, challenges: { ...p.challenges, items } }))}
                    template={{ constraint: '', constraintBody: '', codeBefore: '', resolution: '', resolutionBody: '', codeAfter: '' }}
                    renderItem={(item, idx, onChange, onDel) => (
                      <ChallengeCard item={item} idx={idx} onChange={onChange} onDelete={onDel} />
                    )}
                    addLabel="Add Challenge"
                  />
                </Accordion>

                {/* 04 Tech Stack */}
                <Accordion label="04 — Tech Stack Section">
                  <CsSectionHeader data={cs.stack} onChange={v => setCs(p => ({ ...p, stack: { ...p.stack, ...v } }))} />
                  <label className={`${labelCls} mt-4`}>Categories</label>
                  <div className="space-y-4">
                    {cs.stack.categories.map((cat, ci) => (
                      <div key={ci} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <input className={`${inputCls} flex-1`} placeholder="Category name (e.g. Backend)" value={cat.name}
                            onChange={e => {
                              const cats = [...cs.stack.categories];
                              cats[ci] = { ...cats[ci], name: e.target.value };
                              setCs(p => ({ ...p, stack: { ...p.stack, categories: cats } }));
                            }} />
                          <button type="button" onClick={() => {
                            setCs(p => ({ ...p, stack: { ...p.stack, categories: p.stack.categories.filter((_, i) => i !== ci) } }));
                          }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                        <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Comma-separated items: React, TypeScript, Vite"
                          value={cat.items.join(', ')}
                          onChange={e => {
                            const cats = [...cs.stack.categories];
                            cats[ci] = { ...cats[ci], items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) };
                            setCs(p => ({ ...p, stack: { ...p.stack, categories: cats } }));
                          }} />
                      </div>
                    ))}
                    <button type="button" onClick={() => setCs(p => ({ ...p, stack: { ...p.stack, categories: [...p.stack.categories, { name: '', items: [] }] } }))}
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors w-full justify-center">
                      <Plus size={14} /> Add Category
                    </button>
                  </div>
                </Accordion>

                {/* 05 Impact */}
                <Accordion label="05 — Impact Section">
                  <CsSectionHeader data={cs.impact} onChange={v => setCs(p => ({ ...p, impact: { ...p.impact, ...v } }))} />

                  <label className={`${labelCls} mt-4`}>Stats</label>
                  <div className="space-y-2 mb-3">
                    {cs.impact.stats.map((stat, si) => (
                      <div key={si} className="flex items-center gap-3">
                        <input className={`${inputCls} w-28`} placeholder="2,000+" value={stat.value}
                          onChange={e => { const s=[...cs.impact.stats]; s[si]={...s[si],value:e.target.value}; setCs(p=>({...p,impact:{...p.impact,stats:s}})); }} />
                        <input className={`${inputCls} flex-1`} placeholder="Members in production" value={stat.label}
                          onChange={e => { const s=[...cs.impact.stats]; s[si]={...s[si],label:e.target.value}; setCs(p=>({...p,impact:{...p.impact,stats:s}})); }} />
                        <button type="button" onClick={() => setCs(p=>({...p,impact:{...p.impact,stats:p.impact.stats.filter((_,i)=>i!==si)}}))}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><X size={14} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setCs(p=>({...p,impact:{...p.impact,stats:[...p.impact.stats,{value:'',label:''}]}}))}
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors w-full justify-center mt-1">
                      <Plus size={14} /> Add Stat
                    </button>
                  </div>

                  <label className={`${labelCls} mt-4`}>Highlights</label>
                  <ItemsEditor
                    items={cs.impact.highlights}
                    onChange={items => setCs(p => ({ ...p, impact: { ...p.impact, highlights: items } }))}
                    template={{ emoji: '✅', title: '', body: '' }}
                    renderItem={(item, idx, onChange, onDel) => (
                      <EmojiCard item={item} idx={idx} onChange={onChange} onDelete={onDel} />
                    )}
                    addLabel="Add Highlight"
                  />
                </Accordion>
              </div>
            )}
          </Section>

          {/* bottom save */}
          <div className="flex items-center gap-4 pt-4">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-primary/25">
              <Save size={16} /> {saving ? 'Saving…' : 'Save All Changes'}
            </button>
            <Link to="/admin/projects" className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════ */
const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5';

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════ */

/* Section wrapper */
import { forwardRef } from 'react';
const Section = forwardRef<HTMLDivElement, { id: string; label: string; icon: React.ReactNode; children: React.ReactNode }>(
  ({ id, label, icon, children }, ref) => (
    <div ref={ref} id={id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden scroll-mt-24">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
        <span className="text-primary">{icon}</span>
        <h2 className="font-bold text-slate-900 dark:text-white text-base">{label}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
);

/* Toggle Card */
function ToggleCard({ label, desc, icon, checked, color, onChange }: {
  label: string; desc: string; icon: React.ReactNode; checked: boolean;
  color: 'emerald' | 'blue' | 'amber'; onChange: (v: boolean) => void;
}) {
  const colors = { emerald: 'from-emerald-400 to-emerald-600', blue: 'from-blue-400 to-blue-600', amber: 'from-amber-400 to-amber-600' };
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${checked ? 'border-current bg-white dark:bg-slate-900 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 opacity-60'}`}
      style={{ borderColor: checked ? undefined : undefined }}>
      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white bg-gradient-to-br ${colors[color]}`}>{icon}</div>
      <p className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{label}</p>
      <p className="text-xs text-slate-500">{desc}</p>
      <div className={`mt-3 text-xs font-bold px-2.5 py-1 rounded-full inline-block ${checked ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
        {checked ? 'ON' : 'OFF'}
      </div>
    </button>
  );
}

/* Chip Input */
function ChipInput({ label, value, onChange, placeholder, colorClass = 'bg-primary/10 text-primary' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; colorClass?: string;
}) {
  const chips = value.split(',').map(s => s.trim()).filter(Boolean);
  const [inputVal, setInputVal] = useState('');

  const add = () => {
    const v = inputVal.trim(); if (!v) return;
    onChange([...chips, v].join(', '));
    setInputVal('');
  };
  const remove = (i: number) => onChange(chips.filter((_, idx) => idx !== i).join(', '));

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
        {chips.map((c, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${colorClass}`}>
            {c}
            <button type="button" onClick={() => remove(i)} className="opacity-60 hover:opacity-100"><X size={11} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} value={inputVal} placeholder={placeholder}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }} />
        <button type="button" onClick={add}
          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all">
          Add
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

/* Accordion */
function Accordion({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
        <span className="font-bold text-sm text-slate-900 dark:text-white">{label}</span>
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

/* Case Study section header fields */
function CsSectionHeader({ data, onChange }: { data: any; onChange: (v: any) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Section Title</label>
        <input className={inputCls} value={data.title} onChange={e => onChange({ title: e.target.value })} placeholder="The Problem" />
      </div>
      <div>
        <label className={labelCls}>Number (e.g. 01)</label>
        <input className={inputCls} value={data.number} onChange={e => onChange({ number: e.target.value })} placeholder="01" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Lead (bold subheading)</label>
        <input className={inputCls} value={data.lead} onChange={e => onChange({ lead: e.target.value })} placeholder="Short bold statement" />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Body paragraph</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={data.body} onChange={e => onChange({ body: e.target.value })} placeholder="Supporting paragraph text" />
      </div>
    </div>
  );
}

/* Generic items editor */
function ItemsEditor<T>({ items, onChange, template, renderItem, addLabel }: {
  items: T[]; onChange: (items: T[]) => void;
  template: T; renderItem: (item: T, idx: number, onChange: (v: Partial<T>) => void, onDel: () => void) => React.ReactNode;
  addLabel: string;
}) {
  const update = (idx: number, v: Partial<T>) => {
    const next = [...items]; next[idx] = { ...next[idx], ...v }; onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, { ...template }]);
  return (
    <div className="space-y-3 mt-4">
      {items.map((item, idx) => renderItem(item, idx, (v) => update(idx, v), () => remove(idx)))}
      <button type="button" onClick={add}
        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors w-full justify-center">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

/* Emoji card editor (problem / solution / highlights) */
function EmojiCard({ item, idx, onChange, onDelete }: {
  item: CsItem; idx: number; onChange: (v: Partial<CsItem>) => void; onDelete: () => void;
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 relative group">
      <button type="button" onClick={onDelete}
        className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={14} />
      </button>
      <div className="flex gap-3">
        <div>
          <label className={labelCls}>Emoji</label>
          <input className={`${inputCls} w-16 text-center text-lg`} value={item.emoji} onChange={e => onChange({ emoji: e.target.value })} placeholder="🔴" />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Card Title</label>
          <input className={inputCls} value={item.title} onChange={e => onChange({ title: e.target.value })} placeholder={`Card ${idx + 1} title`} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={item.body} onChange={e => onChange({ body: e.target.value })} placeholder="Explain the problem or feature…" />
      </div>
    </div>
  );
}

/* Challenge card editor */
function ChallengeCard({ item, idx, onChange, onDelete }: {
  item: CsChallenge; idx: number; onChange: (v: Partial<CsChallenge>) => void; onDelete: () => void;
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden relative group">
      <button type="button" onClick={onDelete}
        className="absolute top-3 right-3 z-10 p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={14} />
      </button>
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border-b border-slate-200 dark:border-slate-700 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Constraint</p>
        <div>
          <label className={labelCls}>Constraint Title</label>
          <input className={inputCls} value={item.constraint} onChange={e => onChange({ constraint: e.target.value })} placeholder="The problem that blocked progress" />
        </div>
        <div>
          <label className={labelCls}>Constraint Detail</label>
          <textarea className={`${inputCls} resize-none`} rows={2} value={item.constraintBody} onChange={e => onChange({ constraintBody: e.target.value })} placeholder="Explain the technical constraint in detail…" />
        </div>
        <div>
          <label className={`${labelCls} font-mono`}>Code Before (optional)</label>
          <textarea className={`${inputCls} resize-none font-mono text-xs`} rows={3} value={item.codeBefore} onChange={e => onChange({ codeBefore: e.target.value })} placeholder="// The problematic code" />
        </div>
      </div>
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Resolution</p>
        <div>
          <label className={labelCls}>Resolution Title</label>
          <input className={inputCls} value={item.resolution} onChange={e => onChange({ resolution: e.target.value })} placeholder="How you solved it" />
        </div>
        <div>
          <label className={labelCls}>Resolution Detail</label>
          <textarea className={`${inputCls} resize-none`} rows={2} value={item.resolutionBody} onChange={e => onChange({ resolutionBody: e.target.value })} placeholder="Explain the solution and why it works…" />
        </div>
        <div>
          <label className={`${labelCls} font-mono`}>Code After (optional)</label>
          <textarea className={`${inputCls} resize-none font-mono text-xs`} rows={3} value={item.codeAfter} onChange={e => onChange({ codeAfter: e.target.value })} placeholder="// The fixed code" />
        </div>
      </div>
    </div>
  );
}
