'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';

interface Item {
  id?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
}

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const search = query ? `&q=${encodeURIComponent(query)}` : '';
      const response = await api.get<{ items: Item[]; total: number; page: number; pageSize: number }>(
        `/api/items?page=${page}&pageSize=${pageSize}${search}`
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
  }, [page, pageSize, query]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Items</h1>
          <p className="text-sm text-secondary">Browse, search, and manage items.</p>
        </div>
        <Link href="/items/new">
          <Button>Create Item</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <Input
                label="Search"
                name="search"
                placeholder="Search by name or description"
                value={queryInput}
                onChange={event => setQueryInput(event.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" className="md:mb-0">
              Search
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-5 w-5" />
              <span className="text-sm text-secondary">Loading items...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-error">{error}</p>
          ) : items.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-secondary">No items found.</p>
              <Link href="/items/new" className="text-sm font-medium text-primary hover:text-primary-hover">
                Create the first item
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex flex-col gap-2 rounded-md border border-border p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name || 'Untitled Item'}</h3>
                      <p className="text-sm text-secondary">{item.description || 'No description provided.'}</p>
                    </div>
                    {item.id && (
                      <Link href={`/items/${item.id}`} className="text-sm font-medium text-primary hover:text-primary-hover">
                        View details
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-secondary">
                    Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-secondary">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ItemsPage;
