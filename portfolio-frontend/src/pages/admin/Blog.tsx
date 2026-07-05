
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import AdminLayout from '@/components/layout/AdminLayout';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { 
  getBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '@/lib/api';
import { 
  Button, 
  InputField, 
  TextareaField,
  SelectField,
  Card,
  Badge,
  LoadingSpinner,
  EmptyState
} from '@/components/admin/AdminUI';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  FileText, 
  Image as ImageIcon,
  Tag,
  Eye,
  Clock,
  CheckCircle,
  X,
  Search,
  Globe,
  Code2
} from 'lucide-react';

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Engineering',
    tags: '',
    readTime: 5,
    featured: false,
    published: true,
    author: 'Chikku'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getBlogs(); 
      setBlogs(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingId && !newBlog.slug) {
       const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
       setNewBlog(prev => ({ ...prev, title, slug }));
    } else {
       setNewBlog(prev => ({ ...prev, title }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...newBlog,
      tags: typeof newBlog.tags === 'string' ? newBlog.tags.split(',').map(t => t.trim()) : newBlog.tags
    };

    try {
      if (editingId) {
        await updateBlog(editingId, payload);
      } else {
        await createBlog(payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error saving blog post");
    }
  };

  const handleEdit = (blog: any) => {
    setNewBlog({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || '',
      category: blog.category || 'Engineering',
      tags: blog.tags ? blog.tags.join(', ') : '',
      readTime: blog.readTime || 5,
      featured: blog.featured || false,
      published: blog.published !== false,
      author: blog.author || 'Chikku'
    });
    setEditingId(blog._id);
    setShowForm(true);
    setActiveTab('editor'); // Reset to editor when editing
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteBlog(id);
      fetchData();
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const resetForm = () => {
    setNewBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Engineering',
      tags: '',
      readTime: 5,
      featured: false,
      published: true,
      author: 'Chikku'
    });
    setEditingId(null);
    setShowForm(false);
    setActiveTab('editor');
  };

  if (loading) {
    return (
      <AdminLayout title="Journal" subtitle="Manage your blog posts">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Journal Manager" 
      subtitle="Write and publish technical articles"
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
               Total Posts: <span className="text-primary">{blogs.length}</span>
             </div>
             <div className="hidden md:flex gap-2">
                <Badge variant="success">{blogs.filter(b => b.published).length} Published</Badge>
                <Badge variant="warning">{blogs.filter(b => !b.published).length} Drafts</Badge>
             </div>
          </div>
          <Button
            onClick={() => {
                if (showForm) resetForm();
                else setShowForm(true);
            }}
            variant="primary"
            icon={showForm ? <X size={18} /> : <Plus size={18} />}
          >
            {showForm ? 'Cancel Editor' : 'New Article'}
          </Button>
        </div>

        {/* Editor Form */}
        {showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
             {/* Left Column: Main Editor */}
             <div className="lg:col-span-2 space-y-6">
                <Card title="Content Editor" icon={<Edit2 size={20}/>}>
                   <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                      <button 
                        onClick={() => setActiveTab('editor')}
                        className={`pb-3 px-1 font-bold text-sm transition-colors relative ${activeTab === 'editor' ? 'text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                      >
                        Markdown Editor
                        {activeTab === 'editor' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                      </button>
                      <button 
                        onClick={() => setActiveTab('preview')}
                         className={`pb-3 px-1 font-bold text-sm transition-colors relative ${activeTab === 'preview' ? 'text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                      >
                        Live Preview (Syntax Highlighting)
                        {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                      </button>
                   </div>

                   {activeTab === 'editor' ? (
                      <div className="space-y-6">
                        <InputField
                          label="Article Title"
                          name="title"
                          value={newBlog.title}
                          onChange={handleTitleChange}
                          placeholder="e.g., The Future of React Server Components"
                          required
                          icon={<FileText size={18} />}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InputField
                             label="Slug (URL)"
                             name="slug"
                             value={newBlog.slug}
                             onChange={(e) => setNewBlog({...newBlog, slug: e.target.value})}
                             placeholder="the-future-of-react"
                             required
                             icon={<Search size={18} />}
                           />
                           <SelectField
                             label="Category"
                             name="category"
                             value={newBlog.category}
                             onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                             options={[
                               { value: 'Engineering', label: 'Engineering' },
                               { value: 'Design', label: 'Design' },
                               { value: 'Tutorial', label: 'Tutorial' },
                               { value: 'Career', label: 'Career' },
                               { value: 'Life', label: 'Life' }
                             ]}
                           />
                        </div>

                        <TextareaField
                          label="Short Excerpt (SEO)"
                          name="excerpt"
                          value={newBlog.excerpt}
                          onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                          placeholder="Brief summary for search results and cards (150-160 chars)"
                          rows={3}
                        />

                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Main Content (Markdown)
                             </label>
                             {/* Toolbar */}
                             <div className="flex gap-2">
                               <button 
                                 type="button"
                                 onClick={() => setNewBlog(prev => ({ ...prev, content: prev.content + '\n\n**Bold Text**' }))}
                                 className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors text-xs font-bold"
                                 title="Bold"
                               >
                                 B
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => setNewBlog(prev => ({ ...prev, content: prev.content + '\n\n*Italic Text*' }))}
                                 className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors text-xs italic font-serif"
                                 title="Italic"
                               >
                                 I
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => setNewBlog(prev => ({ ...prev, content: prev.content + '\n\n```typescript\n// Your code here\nconsole.log("Hello");\n```\n' }))}
                                 className="flex items-center gap-1 p-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors text-xs font-bold"
                                 title="Insert Code Block"
                               >
                                 <Code2 size={12} /> Code
                               </button>
                             </div>
                           </div>
                           <textarea
                             value={newBlog.content}
                             onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                             placeholder="# Start writing your masterpiece...\n\n```typescript\nconsole.log('Hello World');\n```"
                             rows={20}
                             className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                           />
                           <p className="text-xs text-slate-500">Supports Github Flavored Markdown (GFM) & Syntax Highlighting</p>
                        </div>
                      </div>
                   ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[500px] overflow-auto prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl">
                         {newBlog.content ? (
                           <ReactMarkdown
                             remarkPlugins={[remarkGfm]}
                             rehypePlugins={[rehypeHighlight]}
                           >
                             {newBlog.content}
                           </ReactMarkdown>
                         ) : (
                           <p className="text-slate-400 italic">Start writing to see preview...</p>
                         )}
                      </div>
                   )}
                </Card>
             </div>

             {/* Right Column: Metadata & Actions */}
             <div className="space-y-6">
                <Card title="Publishing" icon={<Globe size={20}/>}>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                         <span className="font-bold text-sm">Published Status</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={newBlog.published} 
                             onChange={e => setNewBlog({...newBlog, published: e.target.checked})}
                             className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                         <span className="font-bold text-sm">Featured Post</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={newBlog.featured} 
                             onChange={e => setNewBlog({...newBlog, featured: e.target.checked})}
                             className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                         </label>
                      </div>

                      <InputField
                        label="Read Time (min)"
                        name="readTime"
                        type="number"
                        value={newBlog.readTime.toString()}
                        onChange={(e) => setNewBlog({...newBlog, readTime: parseInt(e.target.value)})}
                        icon={<Clock size={16} />}
                      />

                      <Button 
                        onClick={handleSubmit} 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        icon={<CheckCircle size={20}/>}
                      >
                        {editingId ? 'Update Article' : 'Publish Article'}
                      </Button>
                   </div>
                </Card>

                <Card title="Assets & Meta" icon={<ImageIcon size={20}/>}>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Cover Image</label>
                        <div className="flex gap-2">
                            <div className="flex-grow">
                                <InputField
                                    label=""
                                    name="coverImage"
                                    value={newBlog.coverImage}
                                    onChange={(e) => setNewBlog({...newBlog, coverImage: e.target.value})}
                                    placeholder="https://..."
                                    icon={<ImageIcon size={18} />}
                                />
                            </div>
                            <Button 
                                onClick={() => setShowMediaLibrary(true)}
                                variant="secondary"
                                icon={<ImageIcon size={18} />}
                                className="h-[46px] mt-0.5" 
                            >
                                Browse
                            </Button>
                        </div>
                      </div>
                      
                      {newBlog.coverImage && (
                        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                           <img src={newBlog.coverImage} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                      
                      <InputField
                        label="Tags (comma separated)"
                        name="tags"
                        value={newBlog.tags}
                        onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                        placeholder="React, Next.js, Tutorial"
                        icon={<Tag size={18} />}
                      />
                   </div>
                </Card>
             </div>
          </div>
        )}

        {/* Media Library Modal */}
        {showMediaLibrary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">Select Image</h3>
                <button 
                  onClick={() => setShowMediaLibrary(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow overflow-auto p-4">
                <MediaLibrary 
                  selectionMode 
                  onSelect={(url) => {
                    setNewBlog(prev => ({ ...prev, coverImage: url }));
                    setShowMediaLibrary(false);
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Blog List Table */}
        {!showForm && (
           <Card className="overflow-hidden p-0">
             {blogs.length === 0 ? (
               <div className="p-8">
                  <EmptyState
                    icon={<FileText size={48} />}
                    title="No Articles Found"
                    description="Your journal is empty. Start writing your first article now."
                    action={
                      <Button onClick={() => setShowForm(true)} variant="primary" icon={<Plus size={18} />}>
                        Write First Article
                      </Button>
                    }
                  />
               </div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Article</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 {blog.coverImage ? (
                                   <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                      <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                                   </div>
                                 ) : (
                                   <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                      <FileText size={20} />
                                   </div>
                                 )}
                                 <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                                       {blog.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                       <span>{blog.readTime} min read</span>
                                       <span>•</span>
                                       <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              {blog.published ? (
                                <Badge variant="success">Published</Badge>
                              ) : (
                                <Badge variant="warning">Draft</Badge>
                              )}
                              {blog.featured && <span className="ml-2"><Badge variant="primary">Featured</Badge></span>}
                           </td>
                           <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
                                {blog.category}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                                   className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                   title="View Live"
                                 >
                                    <Eye size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleEdit(blog)}
                                   className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                   title="Edit"
                                 >
                                    <Edit2 size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(blog._id)}
                                   className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                   title="Delete"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
           </Card>
        )}
      </div>
    </AdminLayout>
  );
}
