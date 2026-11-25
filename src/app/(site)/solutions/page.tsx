import Link from 'next/link';
import { Hero, FinalCta } from '@/components/Section';
export const metadata = { title: 'Solutions' };
const rows = [
  ['Universities', 'Consistent integrity processes across departments and large cohorts.', 'Shared standards, role based access and aggregate reporting.'],
  ['Colleges', 'Fair review of coursework with limited staff time.', 'Fast reports that point reviewers to the passages that matter.'],
  ['Secondary Schools', 'Teaching students how to attribute sources properly.', 'Feedback that supports learning rather than punishment.'],
  ['Students', 'Uncertainty about whether work is properly cited.', 'Check drafts before submission and learn from the report.'],
  ['Lecturers', 'Hours spent checking submissions by hand.', 'Clear matches with context, so judgement stays with you.'],
  ['Academic Researchers', 'Self checking manuscripts and overlapping publications.', 'A private place to review drafts before they go out.'],
  ['Publishers', 'Screening submissions for overlap with prior work.', 'Documented reports with reference numbers for editorial records.'],
  ['Research Institutions', 'Maintaining research integrity across teams.', 'Organisation wide visibility with strict data separation.'],
  ['Corporate Organisations', 'Protecting the originality of reports and publications.', 'Review content before it is published under your name.'],
];
export default function Solutions() {
  return (
    <>
      <Hero eyebrow="Solutions" title="Built for everyone who cares about original writing" body="Each audience faces different challenges. TrueAuthor adapts its reports and workflow to the people reading them." />
      <section className="container-x grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([t, c, b]) => (
          <div key={t} className="card flex flex-col p-6">
            <h2 className="text-xl font-bold">{t}</h2>
            <p className="mt-3 text-sm"><span className="font-semibold text-brand-navy">Challenge: </span>{c}</p>
            <p className="mt-2 text-sm"><span className="font-semibold text-brand-navy">Benefit: </span>{b}</p>
            <Link href="/signup" className="btn-secondary mt-6 self-start">Get started</Link>
          </div>))}
      </section>
      <FinalCta />
    </>
  );
}
