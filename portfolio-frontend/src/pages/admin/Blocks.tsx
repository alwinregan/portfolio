'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Button, LoadingSpinner, EmptyState } from '@/components/admin/AdminUI';
import { Plus, Trash2, Edit2, LayoutGrid, Layers } from 'lucide-react';
import { BlockFormModal } from '@/components/admin/BlockFormModal';
import { BlockCard } from '@/components/admin/BlockCard';

// Mock API functions - replace with real API calls
const getBlocks = async () => {
  try {
    const response = await fetch('/api/admin/blocks', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  } catch (err) {
    console.error('Failed to fetch blocks:', err);
    return [];
  }
};

const createBlock = async (data: any) => {
  const response = await fetch('/api/admin/blocks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

const updateBlock = async (id: string, data: any) => {
  const response = await fetch(`/api/admin/blocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

const deleteBlock = async (id: string) => {
  const response = await fetch(`/api/admin/blocks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

export default function BlocksAdminPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const blockTypes = [
    'text', 'heading', 'image', 'video', 'code',
    'quote', 'gallery', 'divider', 'custom'
  ];

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const data = await getBlocks();
      setBlocks(data || []);
    } catch (err) {
      console.error('Failed to load blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlock = async (formData: any) => {
    setIsSaving(true);
    try {
      if (editingBlock) {
        await updateBlock(editingBlock._id, formData);
      } else {
        await createBlock(formData);
      }
      resetForm();
      await fetchBlocks();
    } catch (err) {
      console.error('Failed to save block:', err);
      alert('Failed to save block');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    try {
      await deleteBlock(id);
      await fetchBlocks();
    } catch (err) {
      console.error('Failed to delete block:', err);
      alert('Failed to delete block');
    }
  };

  const resetForm = () => {
    setEditingBlock(null);
    setShowForm(false);
  };

  const filteredBlocks = filterType
    ? blocks.filter(b => b.type === filterType)
    : blocks;

  if (loading) {
    return (
      <AdminLayout title="Content Blocks" subtitle="Manage composable content blocks">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Content Blocks" subtitle="Create and manage reusable content blocks">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Total Blocks: <span className="text-primary">{blocks.length}</span>
            </div>
            {filterType && (
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Type: <span className="text-primary capitalize">{filterType}</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              setEditingBlock(null);
              setShowForm(!showForm);
            }}
            variant="primary"
            icon={<Plus size={18} />}
          >
            Add Block
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <BlockFormModal
            block={editingBlock}
            onSubmit={handleSaveBlock}
            onCancel={resetForm}
          />
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4">
          <Button
            variant={filterType === null ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterType(null)}
          >
            All Types ({blocks.length})
          </Button>
          {blockTypes.map(type => {
            const count = blocks.filter(b => b.type === type).length;
            return (
              <Button
                key={type}
                variant={filterType === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type} ({count})
              </Button>
            );
          })}
        </div>

        {/* Blocks Grid */}
        {filteredBlocks.length === 0 ? (
          <EmptyState
            icon={<Layers size={48} />}
            title={filterType ? `No ${filterType} blocks` : 'No Blocks Yet'}
            description="Create reusable content blocks for your pages"
            action={
              <Button
                onClick={() => setShowForm(true)}
                variant="primary"
                icon={<Plus size={18} />}
              >
                Create First Block
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.map((block) => (
              <BlockCard
                key={block._id}
                block={block}
                onEdit={(b) => {
                  setEditingBlock(b);
                  setShowForm(true);
                }}
                onDelete={handleDeleteBlock}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
