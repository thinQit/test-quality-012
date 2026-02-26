'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
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

export function CreateItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await api.post<{ item: Item }>('/api/items', {
      name,
      description: description || undefined,
    });

    if (response.error) {
      setError(response.error);
      toast(response.error, 'error');
      setLoading(false);
      return;
    }

    toast('Item created successfully', 'success');
    const createdId = response.data?.item?.id;
    router.push(createdId ? `/items/${createdId}` : '/items');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Item</h1>
        <p className="text-sm text-secondary">Add a new item to your collection.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Item Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              placeholder="Enter item name"
              value={name}
              onChange={event => setName(event.target.value)}
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
                placeholder="Optional description"
                value={description}
                onChange={event => setDescription(event.target.value)}
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" loading={loading} disabled={!name.trim()}>
                Create Item
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/items')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateItemPage;
