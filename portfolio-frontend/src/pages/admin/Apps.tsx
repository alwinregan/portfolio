
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getAdminApps, createApp, updateApp, deleteApp } from '@/lib/api';
import {
  Button,
  InputField,
  TextareaField,
  Card,
  Badge,
  LoadingSpinner,
} from '@/components/admin/AdminUI';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';

interface App {
  _id: string;
  name: string | { en: string };
  description: string | { en: string };
  icon: string;
  url: string;
  color?: string;
  featured?: boolean;
  published?: boolean;
  order: number;
}

export default function AppsAdminPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    icon: '',
    url: '',
    color: '',
    featured: false,
    published: true,
    order: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAdminApps();
      setApps(data || []);
    } catch (err) {
      console.error('Failed to load apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newApp.name.trim() || !newApp.description.trim() || !newApp.icon.trim() || !newApp.url.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const payload: any = {
      name: { en: newApp.name },
      description: { en: newApp.description },
      icon: newApp.icon,
      url: newApp.url,
      featured: newApp.featured,
      published: newApp.published,
      order: newApp.order,
    };

    if (newApp.color) {
      payload.color = newApp.color;
    }

    try {
      if (editingId) {
        await updateApp(editingId, payload);
      } else {
        await createApp(payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving app:', err);
      alert('Error saving app');
    }
  };

  const handleEdit = (app: App) => {
    const name = typeof app.name === 'object' ? app.name.en : app.name;
    const description = typeof app.description === 'object' ? app.description.en : app.description;
    setNewApp({
      name,
      description,
      icon: app.icon,
      url: app.url,
      color: app.color || '',
      featured: !!app.featured,
      published: app.published !== false,
      order: app.order || 0,
    });
    setEditingId(app._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    try {
      await deleteApp(id);
      fetchData();
    } catch (err) {
      console.error('Error deleting app:', err);
      alert('Error deleting app');
    }
  };

  const resetForm = () => {
    setNewApp({
      name: '',
      description: '',
      icon: '',
      url: '',
      color: '',
      featured: false,
      published: true,
      order: apps.length,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Apps" subtitle="Manage quick access apps">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Apps"
      subtitle="Manage your quick access app launcher"
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Total Apps: <span className="text-primary">{apps.length}</span>
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Featured: <span className="text-amber-600">{apps.filter(a => a.featured).length}</span>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            icon={showForm ? <X size={18} /> : <Plus size={18} />}
          >
            {showForm ? 'Cancel' : 'Add App'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card title={editingId ? 'Edit App' : 'Add New App'} icon={<Zap size={20} />}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField
                  label="App Name"
                  name="name"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  placeholder="GitHub"
                  required
                />

                <InputField
                  label="URL"
                  name="url"
                  type="text"
                  value={newApp.url}
                  onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                  placeholder="https://github.com or /dashboard"
                  required
                />

                <InputField
                  label="Icon (Emoji or URL)"
                  name="icon"
                  value={newApp.icon}
                  onChange={(e) => setNewApp({ ...newApp, icon: e.target.value })}
                  placeholder="🚀 or https://example.com/icon.png"
                  required
                />

                <InputField
                  label="Color (Hex)"
                  name="color"
                  type="color"
                  value={newApp.color}
                  onChange={(e) => setNewApp({ ...newApp, color: e.target.value })}
                  placeholder="#3B82F6"
                />

                <InputField
                  label="Order"
                  name="order"
                  type="number"
                  value={newApp.order}
                  onChange={(e) => setNewApp({ ...newApp, order: parseInt(e.target.value) })}
                  min="0"
                />
              </div>

              <div>
                <TextareaField
                  label="Description"
                  name="description"
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  placeholder="Brief description of what this app does"
                  rows={2}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newApp.featured}
                      onChange={(e) => setNewApp({ ...newApp, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newApp.published}
                      onChange={(e) => setNewApp({ ...newApp, published: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Published</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="primary">
                  {editingId ? 'Update App' : 'Create App'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Apps List */}
        <div className="space-y-4">
          {apps.length === 0 ? (
            <div className="text-center py-12">
              <Zap size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No apps yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {apps
                .sort((a, b) => a.order - b.order)
                .map((app) => {
                  const name = typeof app.name === 'object' ? app.name.en : app.name;
                  const description = typeof app.description === 'object' ? app.description.en : app.description;

                  return (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-primary dark:hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                          {app.icon.startsWith('http') || app.icon.startsWith('/') ? (
                            <img src={app.icon} alt={name} className="w-full h-full object-contain rounded" />
                          ) : (
                            <span className="text-2xl">{app.icon}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                            {app.featured && (
                              <Badge variant="warning" className="text-xs">Featured</Badge>
                            )}
                            {app.published === false && (
                              <Badge variant="secondary" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                          <p className="text-xs text-slate-500 mt-1">{app.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                          #{app.order}
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<Edit2 size={16} />}
                          onClick={() => handleEdit(app)}
                        />
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleDelete(app._id)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
