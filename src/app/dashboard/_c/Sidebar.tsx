'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, FileText, FilePlus2, ScanSearch, Sparkles, Fingerprint, Quote, SpellCheck, PenLine, Bookmark, Share2, Users, Bell, CreditCard, Settings, Menu, X, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'My Documents', icon: FileText },
  { href: '/dashboard/new', label: 'New Analysis', icon: FilePlus2 },
  { href: '/dashboard/reports', label: 'Similarity Reports', icon: ScanSearch },
  { href: '/dashboard/coming-soon?f=AI+Writing+Insights', label: 'AI Writing Insights', icon: Sparkles },
  { href: '/dashboard/coming-soon?f=Authorship+Insights', label: 'Authorship Insights', icon: Fingerprint },
  { href: '/dashboard/coming-soon?f=Citation+Checker', label: 'Citation Checker', icon: Quote },
  { href: '/dashboard/coming-soon?f=Grammar+Checker', label: 'Grammar Checker', icon: SpellCheck },
  { href: '/dashboard/coming-soon?f=Writing+Assistant', label: 'Writing Assistant', icon: PenLine },
  { href: '/dashboard/coming-soon?f=Saved+Reports', label: 'Saved Reports', icon: Bookmark },
  { href: '/dashboard/coming-soon?f=Shared+Documents', label: 'Shared Documents', icon: Share2 },
  { href: '/dashboard/coming-soon?f=Team', label: 'Team', icon: Users },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ name, email }: { name: string; email: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => { const base = href.split('?')[0]; return base === '/dashboard' ? path === base : base === '/dashboard/coming-soon' ? false : path.startsWith(base); };
  const nav = (
    <>
      <div className="px-5 py-5"><Link href="/dashboard"><Logo light /></Link></div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={label} href={href} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active(href) ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <Icon size={17} />{label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold text-white">{name || 'Account'}</p>
        <p className="truncate text-xs text-slate-400">{email}</p>
        <form action="/auth/signout" method="post" className="mt-3">
          <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><LogOut size={16} />Sign out</button>
        </form>
      </div>
    </>
  );
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-brand-navy px-4 py-3 lg:hidden">
        <Logo light />
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="text-white">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="fixed inset-0 z-20 flex flex-col bg-brand-navy pt-14 lg:hidden">{nav}</div>}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-brand-navy lg:flex">{nav}</aside>
    </>
  );
}
