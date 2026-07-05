
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  getAdminCertifications, 
  createCertification, 
  updateCertification, 
  deleteCertification 
} from '@/lib/api';
import { 
  Button, 
  InputField,
  Card,
  Badge,
  LoadingSpinner,
  EmptyState
} from '@/components/admin/AdminUI';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Award,
  ExternalLink,
  Calendar,
  X,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function CertificationsAdminPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAdminCertifications();
    setCerts(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCertification(editingId, newCert);
      } else {
        await createCertification(newCert);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error saving certification");
    }
  };

  const handleEdit = (cert: any) => {
    setNewCert({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      order: cert.order || 0,
      isActive: cert.isActive !== false
    });
    setEditingId(cert._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await deleteCertification(id);
      fetchData();
    } catch (err) {
      alert("Error deleting certification");
    }
  };

  const resetForm = () => {
    setNewCert({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      order: certs.length,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Certifications" subtitle="Manage your certifications">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Certifications" 
      subtitle="Manage your professional certifications and achievements"
    >
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Total Certifications: <span className="text-primary">{certs.length}</span>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            icon={showForm ? <X size={18} /> : <Plus size={18} />}
          >
            {showForm ? 'Cancel' : 'Add Certification'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card 
            title={editingId ? "Edit Certification" : "Add New Certification"} 
            icon={<Award size={20} />}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Certification Name"
                  name="name"
                  value={newCert.name}
                  onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                  placeholder="AWS Solutions Architect - Professional"
                  required
                  icon={<Award size={18} />}
                />

                <InputField
                  label="Issuing Organization"
                  name="issuer"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({...newCert, issuer: e.target.value})}
                  placeholder="Amazon Web Services"
                  required
                  icon={<Building2 size={18} />}
                />

                <InputField
                  label="Issue Date"
                  name="issueDate"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({...newCert, issueDate: e.target.value})}
                  placeholder="MM/YYYY or Year (e.g., 2024)"
                  icon={<Calendar size={18} />}
                />

                <InputField
                  label="Expiry Date (Optional)"
                  name="expiryDate"
                  value={newCert.expiryDate}
                  onChange={(e) => setNewCert({...newCert, expiryDate: e.target.value})}
                  placeholder="MM/YYYY or leave blank if no expiry"
                  icon={<Calendar size={18} />}
                />

                <InputField
                  label="Credential ID"
                  name="credentialId"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({...newCert, credentialId: e.target.value})}
                  placeholder="ABC123XYZ789"
                  icon={<ShieldCheck size={18} />}
                />

                <InputField
                  label="Credential URL"
                  name="credentialUrl"
                  type="url"
                  value={newCert.credentialUrl}
                  onChange={(e) => setNewCert({...newCert, credentialUrl: e.target.value})}
                  placeholder="https://verify.example.com/..."
                  icon={<ExternalLink size={18} />}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="primary" size="lg">
                  {editingId ? 'Update Certification' : 'Add Certification'}
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Certifications Grid */}
        {certs.length === 0 ? (
          <EmptyState
            icon={<Award size={48} />}
            title="No Certifications Added"
            description="Start building your credentials by adding your first certification"
            action={
              <Button onClick={() => setShowForm(true)} variant="primary" icon={<Plus size={18} />}>
                Add Your First Certification
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <Card key={cert._id} className="flex flex-col h-full">
                <div className="flex-grow">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25">
                    <Award size={32} className="text-white" />
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {cert.name}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
                    {cert.issuer}
                  </p>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    {cert.issueDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} />
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    )}
                    {cert.expiryDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} />
                        <span>Expires: {cert.expiryDate}</span>
                      </div>
                    )}
                    {cert.credentialId && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <ShieldCheck size={14} />
                        <span className="font-mono text-xs">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Link */}
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors mb-4"
                    >
                      <ExternalLink size={14} />
                      Verify Credential
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <Button 
                    onClick={() => handleEdit(cert)} 
                    variant="secondary" 
                    size="sm"
                    icon={<Edit2 size={16} />}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(cert._id)} 
                    variant="danger" 
                    size="sm"
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
