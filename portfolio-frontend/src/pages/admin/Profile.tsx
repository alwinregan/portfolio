
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getProfile, updateProfile, uploadImage, exportModule, importModule } from '@/lib/api';
import { 
  Button, 
  InputField, 
  TextareaField,
  Card,
  LoadingSpinner
} from '@/components/admin/AdminUI';
import { 
  Save,
  User as UserIcon,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Camera,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  Upload,
  X,
  Download,
} from 'lucide-react';

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bannerTitle: '',
    bannerSubtitle: '',
    heroPrefix: '',
    heroSuffix: '',
    summary: '',
    about: '',
    location: '',
    email: '',
    avatarUrl: '',
    resumeUrl: '',
    titles: [] as string[],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const data = await exportModule('profile');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `profile-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImporting(true); setImportResult('');
    try {
      const json = JSON.parse(await file.text());
      const profileData = json.profile ?? json;
      const result = await importModule('profile', profileData);
      const msg = Object.entries(result).map(([k, v]) => `${k}: ${v}`).join(' · ');
      setImportResult(`✓ ${msg} — refresh the page to see updated data`);
    } catch (err: any) {
      setImportResult(`✗ ${err?.response?.data?.message || err.message}`);
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data);
      setFormData({
        name: data.name || '',
        role: typeof data.role === 'object' ? data.role.en : (data.role || ''),
        bannerTitle: typeof data.bannerTitle === 'object' ? data.bannerTitle.en : (data.bannerTitle || ''),
        bannerSubtitle: typeof data.bannerSubtitle === 'object' ? data.bannerSubtitle.en : (data.bannerSubtitle || ''),
        heroPrefix: typeof data.heroPrefix === 'object' ? data.heroPrefix.en : (data.heroPrefix || ''),
        heroSuffix: typeof data.heroSuffix === 'object' ? data.heroSuffix.en : (data.heroSuffix || ''),
        summary: typeof data.summary === 'object' ? data.summary.en : (data.summary || ''),
        about: typeof data.about === 'object' ? data.about.en : (data.about || ''),
        location: typeof data.location === 'object' ? data.location.en : (data.location || ''),
        email: data.email || '',
        avatarUrl: data.avatarUrl || '',
        resumeUrl: data.resumeUrl || '',
        titles: data.titles?.map((t: any) => typeof t === 'object' ? t.en : t) || [],
        socialLinks: {
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
          website: data.socialLinks?.website || ''
        }
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setFormData({ ...formData, avatarUrl: res.url });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const res = await uploadImage(file);
      setFormData(prev => ({ ...prev, resumeUrl: res.url }));
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const addTitle = () => {
    if (!newTitle.trim()) return;
    setFormData({ ...formData, titles: [...formData.titles, newTitle.trim()] });
    setNewTitle('');
  };

  const removeTitle = (idx: number) => {
    setFormData({ ...formData, titles: formData.titles.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      role: { en: formData.role },
      bannerTitle: { en: formData.bannerTitle },
      bannerSubtitle: { en: formData.bannerSubtitle },
      heroPrefix: { en: formData.heroPrefix },
      heroSuffix: { en: formData.heroSuffix },
      summary: { en: formData.summary },
      about: { en: formData.about },
      location: { en: formData.location },
      titles: formData.titles.map(t => ({ en: t }))
    };
    try {
      await updateProfile(payload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Profile" subtitle="Manage your professional profile">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Profile" 
      subtitle="Manage your professional identity and information"
    >
      {/* Export / Import toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 max-w-5xl">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Profile data:</span>
        <button onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all">
          <Download size={14} /> Export JSON
        </button>
        <button onClick={() => importRef.current?.click()} disabled={importing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all disabled:opacity-50">
          <Upload size={14} /> {importing ? 'Importing…' : 'Import JSON'}
        </button>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        {importResult && (
          <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${importResult.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
            {importResult}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        {/* Basic Information */}
        <Card title="Basic Information" subtitle="Your core identity" icon={<UserIcon size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              required
              icon={<UserIcon size={18} />}
            />

            <InputField
              label="Primary Role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="Senior Full Stack Developer"
              required
              icon={<Briefcase size={18} />}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
              required
              icon={<Mail size={18} />}
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="San Francisco, CA"
              icon={<MapPin size={18} />}
            />
          </div>
        </Card>

        {/* Avatar & Resume */}
        <Card title="Media Assets" subtitle="Profile image and resume" icon={<Camera size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {formData.avatarUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800">
                    <img 
                      src={formData.avatarUrl?.startsWith('/') ? `${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${formData.avatarUrl}` : formData.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, avatarUrl: ''})}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer">
                  <div className="px-6 py-3 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary/20 transition-all flex items-center gap-2">
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload Image
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleAvatarUpload} 
                    accept="image/*" 
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">JPG, PNG, WEBP (Max 5MB)</p>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Resume (PDF)
              </label>
              <div className="flex flex-col gap-2">
                {formData.resumeUrl && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <FileText size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <a
                      href={formData.resumeUrl.startsWith('/') ? `${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${formData.resumeUrl}` : formData.resumeUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate hover:underline"
                    >
                      {formData.resumeUrl.split('/').pop() || 'resume.pdf'}
                    </a>
                    <button type="button" onClick={() => setFormData({ ...formData, resumeUrl: '' })}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                    {uploadingResume ? (
                      <><Upload size={18} className="text-primary animate-pulse" /><span className="text-sm font-semibold text-primary">Uploading…</span></>
                    ) : (
                      <><Upload size={18} className="text-slate-400" /><span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Upload PDF</span></>
                    )}
                    <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
                  </label>
                  <input
                    type="text"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="or paste URL…"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <p className="text-xs text-slate-500">Upload a PDF or paste an external URL (Google Drive, Dropbox, etc.)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Hero Section */}
        <Card title="Hero Section" subtitle="Main banner content" icon={<Briefcase size={20} />}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Hero Prefix"
                name="heroPrefix"
                value={formData.heroPrefix}
                onChange={(e) => setFormData({...formData, heroPrefix: e.target.value})}
                placeholder="Engineering"
              />

              <InputField
                label="Hero Suffix"
                name="heroSuffix"
                value={formData.heroSuffix}
                onChange={(e) => setFormData({...formData, heroSuffix: e.target.value})}
                placeholder="With Scale"
              />

              <InputField
                label="Banner Title"
                name="bannerTitle"
                value={formData.bannerTitle}
                onChange={(e) => setFormData({...formData, bannerTitle: e.target.value})}
                placeholder="Quality Driven"
              />

              <InputField
                label="Banner Subtitle"
                name="bannerSubtitle"
                value={formData.bannerSubtitle}
                onChange={(e) => setFormData({...formData, bannerSubtitle: e.target.value})}
                placeholder="Design → Build → Deploy"
              />
            </div>

            {/* Rotating Titles */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Rotating Titles
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTitle())}
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  placeholder="Add a rotating title..."
                />
                <Button type="button" onClick={addTitle} variant="primary" icon={<Plus size={18} />}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.titles.map((title, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20"
                  >
                    <span className="font-semibold text-sm">{title}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTitle(idx)}
                      className="text-primary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {formData.titles.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No rotating titles added yet</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* About & Summary */}
        <Card title="About & Summary" subtitle="Your professional story" icon={<FileText size={20} />}>
          <div className="space-y-6">
            <TextareaField
              label="Hero Summary"
              name="summary"
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              placeholder="A brief, catchy description for the hero section..."
              rows={3}
            />

            <TextareaField
              label="Professional Bio"
              name="about"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              placeholder="Your comprehensive professional journey and expertise..."
              rows={8}
            />
          </div>
        </Card>

        {/* Social Links */}
        <Card title="Social Links" subtitle="Connect with your audience" icon={<Globe size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="GitHub"
              name="github"
              value={formData.socialLinks.github}
              onChange={(e) => setFormData({
                ...formData, 
                socialLinks: { ...formData.socialLinks, github: e.target.value }
              })}
              placeholder="https://github.com/username"
              icon={<Github size={18} />}
            />

            <InputField
              label="LinkedIn"
              name="linkedin"
              value={formData.socialLinks.linkedin}
              onChange={(e) => setFormData({
                ...formData, 
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/in/username"
              icon={<Linkedin size={18} />}
            />

            <InputField
              label="Twitter / X"
              name="twitter"
              value={formData.socialLinks.twitter}
              onChange={(e) => setFormData({
                ...formData, 
                socialLinks: { ...formData.socialLinks, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/username"
              icon={<Twitter size={18} />}
            />

            <InputField
              label="Personal Website"
              name="website"
              value={formData.socialLinks.website}
              onChange={(e) => setFormData({
                ...formData, 
                socialLinks: { ...formData.socialLinks, website: e.target.value }
              })}
              placeholder="https://yourwebsite.com"
              icon={<Globe size={18} />}
            />
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={saving}
            icon={<Save size={20} />}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
