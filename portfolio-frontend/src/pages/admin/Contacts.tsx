
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getAdminContacts, updateContactStatus, deleteContact } from '@/lib/api';
import { Mail, Calendar, Clock, Loader2, CheckCircle2, Trash2, Search, Filter, MailOpen, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string; // 'unread', 'read', 'replied'
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, statusFilter, contacts]);

  const fetchContacts = async () => {
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(lowerTerm) ||
        c.email.toLowerCase().includes(lowerTerm) ||
        c.subject.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredContacts(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
      await updateContactStatus(id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchContacts(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      setContacts(contacts.filter(c => c._id !== id));
      await deleteContact(id);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      fetchContacts();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'unread': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'read': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'replied': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Messages" subtitle="View and manage contact form submissions">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Messages" subtitle="View and manage contact form submissions">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
                  {['all', 'unread', 'read', 'replied'].map((filter) => (
                      <button
                          key={filter}
                          onClick={() => setStatusFilter(filter)}
                          className={`px-4 py-2 text-sm font-bold rounded-md transition-all capitalize whitespace-nowrap ${
                              statusFilter === filter 
                              ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                          {filter}
                      </button>
                  ))}
              </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
            {filteredContacts.map((contact) => (
            <motion.div
                key={contact._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-slate-900 border ${contact.status === 'unread' ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-6 transition-all hover:shadow-lg group relative overflow-hidden`}
            >
                {/* Status Indicator Stripe */}
                {contact.status === 'unread' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}

                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${contact.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-lg ${contact.status === 'unread' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {contact.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(contact.status)}`}>
                                {contact.status}
                            </span>
                        </div>
                        <a href={`mailto:${contact.email}`} className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 transition-colors">
                            <Mail size={12} /> {contact.email}
                        </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-start">
                         <div className="text-xs font-medium text-slate-400 flex flex-col items-end">
                             <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(contact.createdAt).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-1 mt-1">
                                <Clock size={12} />
                                {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                         </div>
                         
                         {/* Action Buttons */}
                         <div className="flex items-center gap-1 pl-4 border-l border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                            {contact.status === 'unread' && (
                                <button 
                                    onClick={() => handleStatusUpdate(contact._id, 'read')}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-colors"
                                    title="Mark as Read"
                                >
                                    <MailOpen size={18} />
                                </button>
                            )}
                            {contact.status !== 'replied' && (
                                <button 
                                    onClick={() => handleStatusUpdate(contact._id, 'replied')}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-green-500 transition-colors"
                                    title="Mark as Replied"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                            )}
                            <button 
                                onClick={() => handleDelete(contact._id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                         </div>
                    </div>
                </div>
                
                <div className="pl-0 md:pl-[60px]">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{contact.subject}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        {contact.message}
                    </p>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>

        {filteredContacts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <XCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No messages found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
