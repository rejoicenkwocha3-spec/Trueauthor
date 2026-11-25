import Link from 'next/link';
export function Hero({ eyebrow, title, body, children }: { eyebrow?: string; title: string; body: string; children?: React.ReactNode }) {
  return (
    <section className="bg-brand-bg">
      <div className="container-x py-16 sm:py-24">
        {eyebrow && <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">{body}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
export function Grid({ items, cols = 3 }: { items: { title: string; body: string; tag?: string }[]; cols?: 2 | 3 }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : ''}`}>
      {items.map((i) => (
        <div key={i.title} className="card p-6">
          <h3 className="text-lg font-bold">{i.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{i.body}</p>
          {i.tag && <span className="mt-4 inline-block rounded-full bg-brand-bg px-2.5 py-0.5 text-xs font-semibold text-brand-navy">{i.tag}</span>}
        </div>
      ))}
    </div>
  );
}
export function Block({ title, intro, children, tint }: { title: string; intro?: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <section className={tint ? 'bg-brand-bg' : ''}><div className="container-x py-16">
      <h2 className="text-3xl font-extrabold">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-slate-600">{intro}</p>}
      <div className="mt-10">{children}</div></div></section>
  );
}
export function FinalCta() {
  return (
    <section className="bg-brand-navy"><div className="container-x py-16 text-center">
      <h2 className="text-3xl font-extrabold text-white">Original work deserves recognition</h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">Create an account and run your first similarity analysis today.</p>
      <Link href="/signup" className="btn-coral mt-8">Get Started</Link></div></section>
  );
}
