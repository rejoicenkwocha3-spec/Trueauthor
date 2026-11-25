import Link from 'next/link';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>{subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}</div>
      {action}
    </div>
  );
}

export function Empty({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600">{body}</p>
      {href && cta && <Link href={href} className="btn-primary mt-6">{cta}</Link>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = { queued: 'bg-slate-100 text-slate-700', processing: 'bg-blue-50 text-blue-700', completed: 'bg-emerald-50 text-emerald-700', failed: 'bg-red-50 text-red-700' };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${s[status] ?? s.queued}`}>{status}</span>;
}
