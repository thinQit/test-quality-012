'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/items', label: 'Items' },
  { href: '/items/new', label: 'Create Item' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4" aria-label="Main navigation">
        <Link href="/" className="text-lg font-semibold" aria-label="Go to dashboard">
          test-quality-012
        </Link>
        <button
          className="rounded-md border border-border p-2 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
          <span className="mt-1 block h-0.5 w-5 bg-foreground" />
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">{user?.name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary">Login</Link>
              <Link href="/signup" className="text-sm font-medium text-foreground hover:text-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
      <div className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <div className="flex flex-col gap-2 border-t border-border px-4 py-4">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              className="text-left text-sm font-medium text-foreground hover:text-primary"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
