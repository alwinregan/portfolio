
import { useState, useEffect } from 'react';
;
import { 
  uploadImage, 
  getUploadedFiles, 
  deleteUploadedFile 
} from '@/lib/api';
import { 
  Upload, 
  Trash2, 
  FileImage, 
  Check, 
  X, 
  Search, 
  Loader2,
  Copy,
  Video,
  FileText
} from 'lucide-react';
import { Button, InputField, Card, LoadingSpinner, EmptyState } from '@/components/admin/AdminUI';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  selectionMode?: boolean;
}

export default function MediaLibrary({ onSelect, selectionMode = false }: MediaLibraryProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getUploadedFiles();
      setFiles(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    
    try {
      await uploadImage(file);
      await fetchFiles();
      setUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this file? This cannot be undone.')) return;

    try {
      await deleteUploadedFile(filename);
      setFiles(prev => prev.filter(f => f.filename !== filename));
      if (selectedFile === filename) setSelectedFile(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file.');
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getFullUrl(url));
    alert('URL copied to clipboard!');
  };

  const filteredFiles = files.filter(f => 
    f.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFullUrl = (url: string) => {
     if (url.startsWith('http')) return url;
     
     const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
     const host = baseUrl.replace('/api', '');
     const cleanUrl = url.startsWith('/') ? url : `/${url}`;
     
     return `${host}${cleanUrl}`;
  };

  const renderThumbnail = (file: any, fullUrl: string) => {
    const ext = file.filename.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
       return (
         <img
           src={fullUrl}
           alt={file.filename}
           className="w-full h-full object-cover"
         />
       );
    }
    
    if (['mp4', 'webm'].includes(ext)) {
       return (
         <div className="flex flex-col items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            <Video size={48} />
            <span className="text-xs font-bold uppercase mt-2">Video</span>
         </div>
       );
    }
    
    if (['pdf'].includes(ext)) {
       return (
         <div className="flex flex-col items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            <FileText size={48} />
            <span className="text-xs font-bold uppercase mt-2">Document</span>
         </div>
       );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
           <FileText size={48} />
           <span className="text-xs font-bold uppercase mt-2">{ext}</span>
        </div>
    );
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search media..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
           />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <label className={`
              flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg cursor-pointer transition-all font-bold text-sm shadow-lg shadow-primary/20
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
           `}>
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              <span>Upload New</span>
              <input 
                type="file" 
                accept="image/*,video/*,application/pdf"
                onChange={handleFileUpload} 
                className="hidden" 
                disabled={uploading}
              />
           </label>
        </div>
      </div>

      {/* Grid */}
      {filteredFiles.length === 0 ? (
        <EmptyState 
           icon={<FileImage size={48} />}
           title="No Media Found"
           description="Upload images, videos, or documents to see them here."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {filteredFiles.map((file) => {
             const fullUrl = getFullUrl(file.url);
             const isSelected = selectedFile === file.filename;
             const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
             
             return (
               <div 
                 key={file.filename}
                 onClick={() => {
                   setSelectedFile(file.filename);
                   if (onSelect) onSelect(fullUrl);
                 }}
                 className={`
                   group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer border-2 transition-all
                   ${isSelected 
                     ? 'border-primary ring-4 ring-primary/10' 
                     : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                   }
                 `}
               >
                 {renderThumbnail(file, fullUrl)}
                 
                 {/* Overlay Actions */}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!selectionMode && (
                      <>
                        <button 
                          onClick={(e) => handleCopyUrl(file.url, e)}
                          className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-colors"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(file.filename, e)}
                          className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {selectionMode && (
                        <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                           Select
                        </div>
                    )}
                 </div>

                 {/* Selection Indicator */}
                 {isSelected && (
                   <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <Check size={14} />
                   </div>
                 )}
                 
                 {/* File Info */}
                 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                   <p className="text-white text-[10px] truncate">{file.filename}</p>
                   <p className="text-white/70 text-[10px]">{sizeInMB} MB</p>
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
