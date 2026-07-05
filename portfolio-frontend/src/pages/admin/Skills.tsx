
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getSkills, createSkill, updateSkill, deleteSkill, exportModule, importModule } from '@/lib/api';
import {
  Button,
  InputField,
  SelectField,
  Card,
  Badge,
  LoadingSpinner,
  EmptyState,
  Table
} from '@/components/admin/AdminUI';
import {
  Plus,
  Trash2,
  Edit2,
  Code2,
  X,
  Eye,
  EyeOff,
  TrendingUp,
  Download,
  Upload,
} from 'lucide-react';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Workflow',
  'AI',
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Computer Vision',
  'Other'
];

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    category: 'Frontend',
    level: 80,
    experienceYears: 1,
    isActive: true,
    order: 0
  });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async () => {
    const data = await exportModule('skills');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `skills-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImporting(true); setImportResult('');
    try {
      const json = JSON.parse(await file.text());
      const arr = Array.isArray(json) ? json : (json.skills ?? []);
      const result = await importModule('skills', arr);
      const msg = Object.entries(result).map(([k, v]) => `${k}: ${v}`).join(' · ');
      setImportResult(`✓ ${msg}`);
      fetchData();
    } catch (err: any) {
      setImportResult(`✗ ${err?.response?.data?.message || err.message}`);
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  const fetchData = async () => {
    const data = await getSkills();
    setSkills(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSkill(editingId, newSkill);
      } else {
        await createSkill(newSkill);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error saving skill");
    }
  };

  const handleEdit = (skill: any) => {
    setNewSkill({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      experienceYears: skill.experienceYears || 1,
      isActive: skill.isActive !== false,
      order: skill.order || 0
    });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkill(id);
      fetchData();
    } catch (err) {
      alert("Error deleting skill");
    }
  };

  const resetForm = () => {
    setNewSkill({ 
      name: '', 
      category: 'Frontend',
      level: 80,
      experienceYears: 1,
      isActive: true,
      order: skills.length
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getSkillBadge = (level: number) => {
    if (level >= 90) return { text: 'Expert', variant: 'success' as const };
    if (level >= 80) return { text: 'Advanced', variant: 'primary' as const };
    if (level >= 70) return { text: 'Proficient', variant: 'info' as const };
    return { text: 'Intermediate', variant: 'warning' as const };
  };

  const columns = [
    {
      key: 'name',
      label: 'Skill Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Code2 size={18} className="text-primary" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'level',
      label: 'Proficiency',
      render: (value: number) => {
        const badge = getSkillBadge(value);
        return (
          <div className="flex items-center gap-3">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{value}%</span>
                <Badge variant={badge.variant}>{badge.text}</Badge>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'experienceYears',
      label: 'Experience',
      render: (value: number) => (
        <span className="font-semibold">{value} {value === 1 ? 'year' : 'years'}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? <Eye size={12} className="inline mr-1" /> : <EyeOff size={12} className="inline mr-1" />}
          {value ? 'Active' : 'Hidden'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button 
            onClick={() => handleEdit(row)} 
            variant="secondary" 
            size="sm"
            icon={<Edit2 size={14} />}
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDelete(row._id)} 
            variant="danger" 
            size="sm"
            icon={<Trash2 size={14} />}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Skills" subtitle="Manage your technical skills">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <AdminLayout 
      title="Skills" 
      subtitle="Manage your technical skills and expertise"
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Total Skills: <span className="text-primary">{skills.length}</span>
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Categories: <span className="text-primary">{Object.keys(skillsByCategory).length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all">
              <Download size={14} /> Export
            </button>
            <button onClick={() => importRef.current?.click()} disabled={importing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all disabled:opacity-50">
              <Upload size={14} /> {importing ? 'Importing…' : 'Import'}
            </button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
            <Button onClick={() => setShowForm(!showForm)} variant="primary" icon={showForm ? <X size={18} /> : <Plus size={18} />}>
              {showForm ? 'Cancel' : 'Add Skill'}
            </Button>
          </div>
        </div>
        {importResult && (
          <div className={`text-sm px-4 py-2.5 rounded-xl font-medium ${importResult.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
            {importResult}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card title={editingId ? "Edit Skill" : "Add New Skill"} icon={<Code2 size={20} />}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Skill Name"
                  name="name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="React, Node.js, etc."
                  required
                  icon={<Code2 size={18} />}
                />

                <SelectField
                  label="Category"
                  name="category"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                  required
                />

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Proficiency Level: {newSkill.level}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                <InputField
                  label="Years of Experience"
                  name="experienceYears"
                  type="number"
                  min="0"
                  max="20"
                  value={newSkill.experienceYears.toString()}
                  onChange={(e) => setNewSkill({...newSkill, experienceYears: parseInt(e.target.value)})}
                  required
                  icon={<TrendingUp size={18} />}
                />
              </div>

              {/* Options */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newSkill.isActive}
                    onChange={e => setNewSkill({...newSkill, isActive: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="font-semibold text-sm">Active (Visible on site)</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="primary" size="lg">
                  {editingId ? 'Update Skill' : 'Create Skill'}
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Skills List */}
        {skills.length === 0 ? (
          <EmptyState
            icon={<Code2 size={48} />}
            title="No Skills Yet"
            description="Start building your skills portfolio by adding your first skill"
            action={
              <Button onClick={() => setShowForm(true)} variant="primary" icon={<Plus size={18} />}>
                Add Your First Skill
              </Button>
            }
          />
        ) : (
          <Card title="All Skills" subtitle={`${skills.length} skills across ${Object.keys(skillsByCategory).length} categories`}>
            <Table columns={columns} data={skills} />
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
