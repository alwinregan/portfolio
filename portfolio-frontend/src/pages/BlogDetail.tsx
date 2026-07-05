import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, Clock, Tag, User, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { getBlogBySlug } from '@/lib/api';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBlogBySlug(slug).then((data: any) => {
      setBlog(data);
      if (data?.title) document.title = `${data.title} | Portfolio Journal`;
    }).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">Return to Journal</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <main className="min-h-screen font-sans selection:bg-primary/30">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-wide uppercase text-sm">Back to Journal</span>
            </Link>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold text-white/80">
              {blog.category && <span className="px-3 py-1 bg-primary text-white rounded-lg uppercase tracking-wider text-xs">{blog.category}</span>}
              <span className="flex items-center gap-2"><Calendar size={14} />{new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock size={14} />{blog.readTime} min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 drop-shadow-lg">{blog.title}</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"><User size={20} className="text-white" /></div>
              <div>
                <div className="text-white font-bold">{blog.author || 'Author'}</div>
                <div className="text-slate-400 text-sm">Full-Stack Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          <article className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-3xl prose-img:shadow-xl prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {blog.content}
            </ReactMarkdown>
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                {blog.tags.map((tag: string) => (
                  <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-muted premium-card">
                    <Tag size={14} />{tag}
                  </div>
                ))}
              </div>
            )}
          </article>
          <aside className="hidden lg:block space-y-8 sticky top-32 h-fit">
            <div className="p-6 premium-card rounded-2xl">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Share</h3>
              <div className="flex gap-2">
                <button onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })} className="p-3 premium-card rounded-xl hover:text-primary transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
