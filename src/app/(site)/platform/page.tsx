import Link from 'next/link';
import { Hero, Grid, Block, FinalCta } from '@/components/Section';
export const metadata = { title: 'Platform' };
export default function Platform() {
  return (
    <>
      <Hero eyebrow="Platform" title="One workspace for writing integrity" body="TrueAuthor brings similarity checking, writing feedback and reporting together so reviewers see the whole picture instead of a single number.">
        <Link href="/signup" className="btn-primary">Get Started</Link><Link href="/features" className="btn-secondary">View features</Link></Hero>
      <Block title="How the work flows" intro="Each step builds on the one before it.">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {['Upload Document', 'Analyse Content', 'Review Similarities', 'Examine Writing Insights', 'Generate Report', 'Improve Originality'].map((s, i) => (
            <li key={s} className="card p-4 text-center"><span className="font-display text-xl font-extrabold text-brand">{i + 1}</span><p className="mt-1 text-sm font-semibold text-brand-navy">{s}</p></li>))}
        </ol>
      </Block>
      <Block tint title="The ecosystem">
        <Grid items={[
          { title: 'Originality Checking', body: 'Compare submissions with authorised sources and see matched passages in context.', tag: 'Available' },
          { title: 'Similarity Analysis', body: 'Phrase level comparison with an explained percentage and exclusion settings.', tag: 'Available' },
          { title: 'AI Writing Insights', body: 'Probabilistic indicators with stated limitations and no automatic accusations.', tag: 'In development' },
          { title: 'Authorship Analysis', body: 'Consistency across authorised writing samples as supporting evidence.', tag: 'In development' },
          { title: 'Citation Checking', body: 'Review references in APA, MLA, Chicago, Harvard and IEEE.', tag: 'In development' },
          { title: 'Grammar Analysis', body: 'Clarity, tone, readability and repetition feedback.', tag: 'In development' },
          { title: 'Writing Feedback', body: 'Suggestions that help writers improve without rewriting their work.', tag: 'In development' },
          { title: 'Document Management', body: 'Store, review and delete documents from one place.', tag: 'Available' },
          { title: 'Academic Integrity Reports', body: 'Reports with a reference number, analysis date and explanation of method.', tag: 'Available' },
          { title: 'Institutional Management', body: 'Organisations, classes, assignments and role based access.', tag: 'In development' },
        ]} />
      </Block>
      <FinalCta />
    </>
  );
}
