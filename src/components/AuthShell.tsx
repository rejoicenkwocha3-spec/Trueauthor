import Link from 'next/link';
import { Logo } from './Logo';

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-block"><Logo /></Link>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <aside className="hidden flex-col justify-center bg-brand-navy px-14 text-white lg:flex">
        <p className="font-display text-3xl font-extrabold leading-tight">Original Work.<br />Authentic Thinking.<br />Trusted Results.</p>
        <p className="mt-6 max-w-md text-slate-300">Similarity is a signal for review, not a verdict. TrueAuthor gives educators and writers clear evidence to make fair decisions.</p>
      </aside>
    </main>
  );
}

export function Alert({ kind, children }: { kind: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const styles = { error: 'border-red-200 bg-red-50 text-red-800', success: 'border-emerald-200 bg-emerald-50 text-emerald-800', info: 'border-blue-200 bg-blue-50 text-blue-800' }[kind];
  return <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
