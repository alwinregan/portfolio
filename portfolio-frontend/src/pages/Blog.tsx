import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogList from '@/components/blog/BlogList';
import { getBlogs } from '@/lib/api';
import { Sparkles } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Journal | Portfolio';
    getBlogs().then((data: any) => {
      const published = (data || []).filter((b: any) => b.published);
      published.sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime();
      });
      setBlogs(published);
    }).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen font-sans selection:bg-primary/30">
      <Navbar />

      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider mb-8 text-slate-600 dark:text-slate-300">
            <Sparkles size={12} className="text-primary" />
            <span>Engineering Journal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-slate-900 dark:text-white leading-tight">
            Code, Design &<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600"> Everything Between.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Deep dives into modern full-stack architecture, system design, and user experience patterns.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-32">
        <BlogList initialBlogs={blogs} />
      </div>

      <Footer />
    </main>
  );
}
