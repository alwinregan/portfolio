import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import { LoadingSpinner, Badge } from '@/components/admin/AdminUI';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface App {
  _id: string;
  name: Record<string, string> | string;
  slug: string;
  description: Record<string, string> | string;
  icon?: string;
  color?: string;
  url: string;
  version?: string;
  featured?: boolean;
  tags?: string[];
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Apps & Tools | Portfolio';
    fetch('/api/apps?limit=100')
      .then(r => r.json())
      .then((data: any) => {
        const d = data?.data || data || [];
        setApps(d);
        const tags = new Set<string>();
        d.forEach((a: App) => a.tags?.forEach((t: string) => tags.add(t)));
        setAllTags(Array.from(tags).sort());
        setFilteredApps(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filter = (query: string, tag: string | null) => {
    let result = apps;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(a => {
        const name = (typeof a.name === 'object' ? (a.name as any).en : a.name) || '';
        const desc = (typeof a.description === 'object' ? (a.description as any).en : a.description) || '';
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      });
    }
    if (tag) result = result.filter(a => a.tags?.includes(tag));
    setFilteredApps(result);
  };

  const handleSearch = (q: string) => { setSearchQuery(q); filter(q, selectedTag); };
  const handleTag = (t: string | null) => { setSelectedTag(t); filter(searchQuery, t); };

  const featuredApps = filteredApps.filter(a => a.featured);
  const otherApps = filteredApps.filter(a => !a.featured);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <main className="min-h-screen bg-page">
      <Navbar />
      <section className="pt-32 py-20 px-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">Apps & Tools</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">Explore tools and utilities built for productivity, analytics, and development.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search apps..." value={searchQuery} onChange={e => handleSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleTag(null)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedTag === null ? 'bg-[#7c3aed] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'}`}>All ({apps.length})</button>
              {allTags.map(tag => <button key={tag} onClick={() => handleTag(tag)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${selectedTag === tag ? 'bg-[#7c3aed] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'}`}>{tag} ({apps.filter(a => a.tags?.includes(tag)).length})</button>)}
            </div>
          )}
          <div className="text-sm text-slate-600 dark:text-slate-400">Showing {filteredApps.length} of {apps.length} apps</div>
        </div>

        {featuredApps.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2"><Star size={28} className="text-amber-500" /> Featured Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{featuredApps.map(a => <AppCard key={a._id} app={a} featured />)}</div>
          </section>
        )}

        <section>
          {featuredApps.length > 0 && <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">All Apps</h2>}
          {filteredApps.length === 0
            ? <p className="text-center py-16 text-xl text-slate-600 dark:text-slate-400">No apps found.</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{otherApps.map(a => <AppCard key={a._id} app={a} />)}</div>
          }
        </section>
      </div>
      <Footer />
    </main>
  );
}

function AppCard({ app, featured }: { app: App; featured?: boolean }) {
  const name = typeof app.name === 'object' ? (app.name as any).en : app.name;
  const description = typeof app.description === 'object' ? (app.description as any).en : app.description;
  const isInternal = app.url.startsWith('/');

  const content = (
    <div className="flex flex-col h-full p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:border-primary" style={{ borderColor: app.color || '#E2E8F0', backgroundColor: app.color ? `${app.color}08` : undefined }}>
      <div className={`mb-6 flex items-start ${featured ? 'flex-col' : 'justify-between'}`}>
        {app.icon && (
          <div className={featured ? 'text-5xl mb-4' : 'text-3xl'}>
            {app.icon.startsWith('http') || app.icon.startsWith('/')
              ? <img src={app.icon} alt={name} className={`rounded-lg ${featured ? 'w-16 h-16' : 'w-12 h-12'}`} />
              : app.icon}
          </div>
        )}
        {featured && <Badge variant="warning" className="self-start"><Star size={12} className="mr-1" /> Featured</Badge>}
      </div>
      <div className="flex-grow">
        <h3 className={`font-bold text-slate-900 dark:text-white mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>{name}</h3>
        <p className={`text-slate-600 dark:text-slate-400 mb-3 ${featured ? 'text-base' : 'text-sm'}`}>{description}</p>
        {app.version && <div className="text-xs text-slate-500 mb-4">v{app.version}</div>}
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {app.tags.map(t => <span key={t} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">{t}</span>)}
          </div>
        )}
      </div>
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 py-2 text-center rounded-lg font-semibold text-white" style={{ backgroundColor: app.color || '#3B82F6' }}>Launch App</div>
      </div>
    </div>
  );

  return isInternal
    ? <Link to={app.url}>{content}</Link>
    : <a href={app.url} target="_blank" rel="noopener noreferrer">{content}</a>;
}
