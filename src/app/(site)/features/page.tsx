import Link from 'next/link';
import { Hero, Block, FinalCta } from '@/components/Section';
export const metadata = { title: 'Features' };
const feats = [
  ['Plagiarism and similarity checking', 'Available', 'Upload or paste text and compare it with documents you have stored. You get a similarity percentage, highlighted matched passages, the source of each match and exclusion settings for references and quotations. TrueAuthor does not claim access to proprietary student paper or publisher databases, and a similarity match is never a confirmed plagiarism finding.'],
  ['Originality reports', 'Available', 'Each report carries a reference number, analysis date, similarity percentage, matched passages with sources and an explanation of the method. PDF export is in development.'],
  ['AI writing insights', 'In development', 'Probabilistic indicators with confidence information and a clear statement of limitations. AI detection can produce false positives and false negatives, so a result is never proof and never grounds for an automatic accusation.'],
  ['Authorship analysis', 'In development', 'Where several authorised writing samples exist, compare vocabulary, sentence structure and style across documents. Findings are supporting evidence, not identity verification.'],
  ['Citation checker', 'In development', 'Review APA, MLA, Chicago, Harvard and IEEE references for missing entries, inconsistencies and formatting errors. Sources that cannot be accessed are never described as verified.'],
  ['Grammar and writing analysis', 'In development', 'Feedback on grammar, punctuation, clarity, tone, readability and repetition, delivered as suggestions without rewriting the author\'s work.'],
];
export default function Features() {
  return (
    <>
      <Hero eyebrow="Features" title="Evidence you can explain" body="Every feature is designed to inform a human decision, with its method and limits stated plainly." />
      <Block title="What TrueAuthor does">
        <div className="space-y-5">
          {feats.map(([t, tag, b]) => (
            <article key={t} className="card p-6"><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold">{t}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tag === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{tag}</span></div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{b}</p></article>))}
        </div>
        <Link href="/signup" className="btn-primary mt-8">Get Started</Link>
      </Block>
      <FinalCta />
    </>
  );
}
