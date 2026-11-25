import { Hero, FinalCta } from '@/components/Section';
export const metadata = { title: 'Pricing' };

// Prices and billing period come from the Selar checkout pages (retrieved 2026-11-25).
// Plan names, features and usage limits are not published on those pages and are not invented here.
const plans = [
  { name: 'Plan 1', price: '$47', href: 'https://selar.com/47plan?currency=USD' },
  { name: 'Plan 2', price: '$57', href: 'https://selar.com/57plan?currency=USD' },
  { name: 'Plan 3', price: '$97', href: 'https://selar.com/97plan?currency=USD' },
];

export default function Pricing() {
  return (
    <>
      <Hero eyebrow="Pricing" title="Simple monthly plans" body="Payments are processed securely by Selar. A subscription is activated only after Selar confirms your payment." />
      <section className="container-x grid gap-6 py-16 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className="card flex flex-col p-8">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="mt-4"><span className="font-display text-5xl font-extrabold text-brand-navy">{p.price}</span><span className="ml-1 text-slate-500">per month</span></p>
            <p className="mt-4 flex-1 text-sm text-slate-600">Feature list and usage limits for this plan are being finalised.</p>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">Subscribe on Selar</a>
          </div>))}
      </section>
      <FinalCta />
    </>
  );
}
