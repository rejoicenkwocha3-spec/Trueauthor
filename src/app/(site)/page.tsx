import Link from 'next/link';
import { Hero, Grid, Block, FinalCta } from '@/components/Section';
import { Demo } from '@/components/Demo';

export default function Home() {
  return (
    <>
      <Hero title="Every Word Matters. Every Original Idea Deserves Recognition."
        body="TrueAuthor helps students, educators and institutions evaluate writing originality, understand text similarity and improve academic integrity with intelligent writing analysis.">
        <Link href="/signup" className="btn-primary">Get Started</Link>
        <Link href="/platform" className="btn-secondary">Explore Platform</Link>
      </Hero>
      <Block title="See how an analysis works" intro="A short walkthrough of the process. This demonstration uses sample text and a sample source, not live customer data.">
        <Demo />
      </Block>
      <Block tint title="Protect academic integrity" intro="Fair decisions need clear evidence.">
        <Grid items={[
          { title: 'Understand text similarity', body: 'See which passages overlap with documents you have access to, how much of the text is affected and where each match comes from.' },
          { title: 'Intelligent writing analysis', body: 'Review grammar, clarity and tone with suggestions that leave the original wording in the writer\'s hands.' },
          { title: 'AI writing insights', body: 'Probabilistic indicators with confidence information and plain statements of their limits. Never a verdict.', tag: 'In development' },
          { title: 'Authorship transparency', body: 'Compare writing style across authorised samples as supporting evidence for a conversation, not proof of identity.', tag: 'In development' },
          { title: 'Citation and referencing assistance', body: 'Check APA, MLA, Chicago, Harvard and IEEE references for gaps and inconsistencies without inventing sources.', tag: 'In development' },
          { title: 'Academic writing improvement', body: 'Help writers learn from feedback so the next draft is stronger and properly attributed.' },
        ]} />
      </Block>
      <Block title="How TrueAuthor works">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[['Upload', 'Paste text or add a document.'], ['Analyse', 'The engine compares phrases against authorised sources.'], ['Review', 'Examine each match in context.'], ['Report', 'Keep a report with a reference number.']].map(([t, b], i) => (
            <li key={t} className="card p-6"><span className="font-display text-3xl font-extrabold text-brand-coral">{i + 1}</span><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-slate-600">{b}</p></li>))}
        </ol>
      </Block>
      <Block tint title="Institutional solutions" intro="Universities, colleges, schools, publishers and research institutions can manage classes, assignments, roles and reporting in one place. Institutional management is in development.">
        <Link href="/solutions" className="btn-secondary">View solutions</Link>
      </Block>
      <Block title="Pricing preview" intro="Three monthly plans, billed securely through Selar.">
        <Link href="/pricing" className="btn-primary">See pricing</Link>
      </Block>
      <FinalCta />
    </>
  );
}
