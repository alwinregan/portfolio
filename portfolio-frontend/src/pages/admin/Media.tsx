
import AdminLayout from '@/components/layout/AdminLayout';
import MediaLibrary from '@/components/admin/MediaLibrary';

export default function MediaPage() {
  return (
    <AdminLayout 
      title="Media Library" 
      subtitle="Manage your images and assets"
    >
      <MediaLibrary />
    </AdminLayout>
  );
}
