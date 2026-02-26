'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';

interface Item {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
}

interface ItemDetailPageProps {
  params: { id: string };
}

export function ItemDetailPage({ params }: ItemDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const response = await api.get<{ item: Item }>(`/api/items/${params.id}`);
      if (!active) return;
      if (response.error) {
        setError(response.error);
        setItem(null);
      } else if (response.data) {
        setItem(response.data.item);
        setError(null);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!item) return;
    setSaving(true);
    const response = await api.put<{ item: Item }>(`/api/items/${params.id}`, {
      name: item.name,
      description: item.description,
    });
    if (response.error) {
      toast(response.error, 'error');
      setSaving(false);
      return;
    }
    if (response.data) {
      setItem(response.data.item);
      toast('Item updated successfully', 'success');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    const response = await api.delete<{}>(`/api/items/${params.id}`);
    if (response.error) {
      toast(response.error, 'error');
      setSaving(false);
      return;
    }
    toast('Item deleted', 'success');
    router.push('/items');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Item Details</h1>
        <p className="text-sm text-secondary">View and update item information.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Item Information</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-5 w-5" />
              <span className="text-sm text-secondary">Loading item...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-error">{error}</p>
          ) : !item ? (
            <p className="text-sm text-secondary">Item not found.</p>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={item.name || ''}
                onChange={event => setItem({ ...item, name: event.target.value })}
                required
              />
              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  value={item.description || ''}
                  onChange={event => setItem({ ...item, description: event.target.value })}
                />
              </div>
              <div className="grid gap-2 text-sm text-secondary md:grid-cols-2">
                <p>Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p>Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button type="submit" loading={saving}>
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/items')}>
                  Back to list
                </Button>
                <Button type="button" variant="destructive" onClick={() => setModalOpen(true)} disabled={saving}>
                  Delete Item
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Delete Item">
        <div className="space-y-4">
          <p className="text-sm text-secondary">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ItemDetailPage;
