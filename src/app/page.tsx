'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface Item {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
}

export function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const response = await api.get<{ items: Item[]; total: number; page: number; pageSize: number }>(
        '/api/items?page=1&pageSize=5'
      );
      if (!active) return;
      if (response.error) {
        setError(response.error);
        setItems([]);
        setTotal(0);
      } else if (response.data) {
        setItems(response.data.items || []);
        setTotal(response.data.total || 0);
        setError(null);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-secondary">Overview of items and recent activity.</p>
        </div>
        <Link href="/items" className="text-sm font-medium text-primary hover:text-primary-hover">
          View all items
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Total Items</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-secondary">Loading...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-error">Unable to load summary.</p>
            ) : (
              <p className="text-3xl font-semibold">{total}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Recent Items</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-secondary">Loading...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-error">Unable to load recent items.</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-secondary">No items yet.</p>
            ) : (
              <p className="text-3xl font-semibold">{items.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-secondary">Status</h2>
          </CardHeader>
          <CardContent>
            <Badge variant={error ? 'error' : 'success'}>{error ? 'Degraded' : 'Healthy'}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Items</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-5 w-5" />
              <span className="text-sm text-secondary">Loading recent items...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-error">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-secondary">Create your first item to see it here.</p>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex flex-col gap-1 border-b border-border pb-3 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{item.name || 'Untitled Item'}</h3>
                    {item.id && (
                      <Link href={`/items/${item.id}`} className="text-sm text-primary hover:text-primary-hover">
                        View
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-secondary">{item.description || 'No description provided.'}</p>
                  <p className="text-xs text-secondary">
                    Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
