
import { useState } from 'react';
import { Link } from 'react-router-dom';
;
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Search, Tag, Filter, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Blog } from '@/types';

interface BlogListProps {
  initialBlogs: Blog[];
}

export default function BlogList({ initialBlogs }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayBlogs = initialBlogs || [];

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(displayBlogs.map(b => b.category || 'Uncategorized').filter(Boolean)))];

  // Filter logic
  const filteredBlogs = displayBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filteredBlogs.find(b => b.featured) || filteredBlogs[0]; // Fallback to first if no featured matches filter
  const remaining = filteredBlogs.filter(b => b._id !== featured?._id);

  if (displayBlogs.length === 0) {
     return (
        <div className="text-center py-32">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Journal Entries Yet</h3>
           <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-md mx-auto">Articles and insights coming soon...</p>
           <p className="text-sm text-slate-500 max-w-md mx-auto">Check back later for technical deep dives and design insights.</p>
        </div>
     );
  }

  if (filteredBlogs.length === 0) {
     return (
        <div className="text-center py-32 border-t border-dashed border-slate-200 dark:border-slate-800">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles found</h3>
           <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any posts matching your criteria. Try different keywords or clear your filters.</p>
           <button
             onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
             className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
           >
             Clear all filters
           </button>
        </div>
     );
  }

  return (
    <div className="space-y-16">
      {/* Search & Filter Bar */}
      <div className="sticky top-24 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-300">
         {/* Categories */}
         <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                 }`}
               >
                 {cat}
               </button>
            ))}
         </div>

         {/* Search */}
         <div className="relative w-full md:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:border-primary/20 hover:border-slate-200 dark:hover:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
            />
         </div>
      </div>

      <AnimatePresence mode='wait'>
         <motion.div
           key={selectedCategory + searchQuery}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
         >
            {/* Featured Post (Only show if it matches filter) */}
            {featured && (
              <div className="mb-24 group relative">
                 <Link to={`/blog/${featured.slug}`} className="block">
                  <div className="relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-3xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 grid lg:grid-cols-[1.5fr_1fr] gap-0">
                    <div className="relative h-[400px] lg:h-[550px] overflow-hidden">
                       <img
                         src={featured.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}
                         alt={featured.title}
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent lg:hidden" />
                       
                       {/* Floating Badges */}
                       <div className="absolute top-6 left-6 flex gap-2">
                           {featured.category && (
                               <div className="px-4 py-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                                 {featured.category}
                               </div>
                           )}
                           {featured.featured && (
                               <div className="px-4 py-2 bg-primary/95 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                                 Featured
                               </div>
                           )}
                       </div>
                    </div>

                    <div className="p-10 lg:p-16 flex flex-col justify-center relative">
                       <div className="flex items-center gap-3 mb-6 relative">
                         <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center gap-2">
                           <Calendar size={16} className="text-primary" /> 
                           {new Date(featured.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                         <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center gap-2">
                           <Clock size={16} className="text-primary" /> 
                           {featured.readTime} min read
                         </span>
                       </div>
                       
                       <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-[1.1] group-hover:text-primary transition-colors duration-300 relative text-slate-900 dark:text-white">
                         {featured.title}
                       </h2>
                       
                       <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 line-clamp-3 leading-relaxed relative">
                         {featured.excerpt}
                       </p>
                       
                       <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                              <User size={18} className="text-slate-600 dark:text-slate-300" />
                           </div>
                           <div>
                               <div className="text-sm font-bold text-slate-900 dark:text-white">{featured.author || 'Chikku'}</div>
                               <div className="text-xs text-slate-500 font-medium">Author</div>
                           </div>
                         </div>
                         
                         <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-300">
                             <ArrowUpRight size={20} className="text-slate-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
                         </div>
                       </div>
                    </div>
                  </div>
                 </Link>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {remaining.map((blog, idx) => (
                <Link to={`/blog/${blog.slug}`} key={blog._id} className="group flex flex-col h-full">
                  <article className="flex-grow flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-[1.5rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 p-2">
                    <div className="relative h-60 overflow-hidden rounded-[1.2rem] mb-6 bg-slate-100 dark:bg-slate-800">
                      <img
                         src={blog.coverImage || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&sig=${idx}`}
                         alt={blog.title}
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       
                       {blog.category && (
                         <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                           {blog.category}
                         </div>
                       )}
                    </div>
                    
                    <div className="px-3 pb-4 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                        <span>{new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>{blog.readTime} min read</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 leading-snug text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center text-primary font-bold text-sm group/btn">
                         <span className="group-hover/btn:mr-2 transition-all duration-300">Read Article</span>
                         <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
         </motion.div>
      </AnimatePresence>
    </div>
  );
}
