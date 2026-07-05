
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  getAdminExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from '@/lib/api';
import { 
  Button, 
  InputField, 
  TextareaField,
  Card,
  Badge,
  LoadingSpinner,
  EmptyState
} from '@/components/admin/AdminUI';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Briefcase,
  Calendar,
  MapPin,
  X,
  Code2,
  CheckCircle
} from 'lucide-react';

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newExp, setNewExp] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAdminExperiences();
    setExperiences(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newExp,
      description: newExp.description.split('\n').filter(s => s.trim()),
      technologies: newExp.technologies.split(',').map(s => s.trim())
    };

    try {
      if (editingId) {
        await updateExperience(editingId, payload);
      } else {
        await createExperience(payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error saving experience");
    }
  };

  const handleEdit = (exp: any) => {
    setNewExp({
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: !!exp.isCurrent,
      description: exp.description?.join('\n') || '',
      technologies: exp.technologies?.join(', ') || '',
      order: exp.order || 0,
      isActive: exp.isActive !== false
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExperience(id);
      fetchData();
    } catch (err) {
      alert("Error deleting experience");
    }
  };

  const resetForm = () => {
    setNewExp({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: '',
      order: experiences.length,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Experience" subtitle="Manage your work experience">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Experience" 
      subtitle="Manage your professional work history"
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Total Positions: <span className="text-primary">{experiences.length}</span>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            icon={showForm ? <X size={18} /> : <Plus size={18} />}
          >
            {showForm ? 'Cancel' : 'Add Experience'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card 
            title={editingId ? "Edit Experience" : "Add New Experience"} 
            icon={<Briefcase size={20} />}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Company Name"
                  name="company"
                  value={newExp.company}
                  onChange={(e) => setNewExp({...newExp, company: e.target.value})}
                  placeholder="Google, Microsoft, etc."
                  required
                  icon={<Briefcase size={18} />}
                />

                <InputField
                  label="Job Title / Role"
                  name="role"
                  value={newExp.role}
                  onChange={(e) => setNewExp({...newExp, role: e.target.value})}
                  placeholder="Senior Software Engineer"
                  required
                  icon={<Briefcase size={18} />}
                />

                <InputField
                  label="Location"
                  name="location"
                  value={newExp.location}
                  onChange={(e) => setNewExp({...newExp, location: e.target.value})}
                  placeholder="San Francisco, CA / Remote"
                  icon={<MapPin size={18} />}
                />

                <InputField
                  label="Start Date"
                  name="startDate"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp({...newExp, startDate: e.target.value})}
                  placeholder="MM/YYYY (e.g., 01/2020)"
                  required
                  icon={<Calendar size={18} />}
                />

                <InputField
                  label="End Date"
                  name="endDate"
                  value={newExp.endDate}
                  onChange={(e) => setNewExp({...newExp, endDate: e.target.value})}
                  placeholder="MM/YYYY or leave blank if current"
                  disabled={newExp.isCurrent}
                  icon={<Calendar size={18} />}
                />

                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newExp.isCurrent}
                      onChange={e => setNewExp({
                        ...newExp, 
                        isCurrent: e.target.checked, 
                        endDate: e.target.checked ? 'Present' : ''
                      })}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-sm">Current Position</span>
                  </label>
                </div>
              </div>

              <InputField
                label="Technologies Used"
                name="technologies"
                value={newExp.technologies}
                onChange={(e) => setNewExp({...newExp, technologies: e.target.value})}
                placeholder="React, Node.js, AWS, Docker (comma-separated)"
                icon={<Code2 size={18} />}
              />

              <TextareaField
                label="Key Responsibilities"
                name="description"
                value={newExp.description}
                onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                placeholder="- Led development of microservices architecture&#10;- Managed team of 5 developers&#10;- Improved system performance by 40%"
                rows={8}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="primary" size="lg">
                  {editingId ? 'Update Experience' : 'Add Experience'}
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Experience Timeline */}
        {experiences.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={48} />}
            title="No Experience Added"
            description="Start building your professional timeline by adding your first work experience"
            action={
              <Button onClick={() => setShowForm(true)} variant="primary" icon={<Plus size={18} />}>
                Add Your First Experience
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={exp._id} className="relative">
                {/* Timeline indicator */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-8 top-full h-6 w-0.5 bg-gradient-to-b from-primary to-transparent" />
                )}
                
                <div className="flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      exp.isCurrent 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25' 
                        : 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25'
                    }`}>
                      <Briefcase size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {exp.role}
                          </h3>
                          {exp.isCurrent && (
                            <Badge variant="success">
                              <CheckCircle size={12} className="inline mr-1" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 mb-3">
                          <span className="flex items-center gap-2 font-semibold">
                            <Briefcase size={16} />
                            {exp.company}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-2">
                              <MapPin size={16} />
                              {exp.location}
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && exp.description.length > 0 && (
                      <div className="mb-4">
                        <ul className="space-y-2">
                          {exp.description.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.technologies.map((tech: string) => (
                          <span 
                            key={tech} 
                            className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <Button 
                        onClick={() => handleEdit(exp)} 
                        variant="secondary" 
                        size="sm"
                        icon={<Edit2 size={16} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDelete(exp._id)} 
                        variant="danger" 
                        size="sm"
                        icon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
