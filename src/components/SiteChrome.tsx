'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const links = [['Home', '/'], ['Platform', '/platform'], ['Solutions', '/solutions'], ['Features', '/features'], ['Pricing', '/pricing']];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="TrueAuthor home"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map(([l, h]) => <Link key={h} href={h} className="text-sm font-medium text-brand-text hover:text-brand">{l}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="btn-secondary">Log in</Link>
          <Link href="/signup" className="btn-primary">Sign up</Link>
        </div>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 pb-5 md:hidden">
          {links.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium">{l}</Link>)}
          <div className="mt-2 flex gap-3"><Link href="/login" className="btn-secondary flex-1">Log in</Link><Link href="/signup" className="btn-primary flex-1">Sign up</Link></div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">© 2026 TrueAuthor</footer>;
}
