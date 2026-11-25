import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/dashboard';
import { PageHeader, StatusBadge } from '@/components/ui';
import type { Match } from '@/lib/similarity';
export const metadata = { title: 'Report' };
export const dynamic = 'force-dynamic';

export default async function Report({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireUser();
  const { data: job } = await supabase.from('ta_analysis_jobs').select('*, ta_documents(title, word_count)').eq('id', id).maybeSingle();
  if (!job) notFound();
  const doc = job.ta_documents as { title: string; word_count: number } | null;
  const matches = (job.matches ?? []) as Match[];
  return (
    <>
      <PageHeader title={doc?.title ?? 'Report'} subtitle={`Reference ${job.reference} · ${new Date(job.created_at).toLocaleString()}`} action={<Link href="/dashboard/reports" className="btn-secondary">All reports</Link>} />
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-5"><p className="text-sm text-slate-500">Status</p><div className="mt-2"><StatusBadge status={job.status} /></div></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Similarity</p><p className="mt-2 font-display text-3xl font-extrabold text-brand-navy">{job.status === 'completed' ? `${Number(job.similarity_percent)}%` : '-'}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Sources compared</p><p className="mt-2 font-display text-3xl font-extrabold text-brand-navy">{job.sources_compared}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Words</p><p className="mt-2 font-display text-3xl font-extrabold text-brand-navy">{doc?.word_count ?? 0}</p></div>
      </div>
      {job.status === 'failed' && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Analysis failed: {job.error ?? 'unknown error'}</p>}
      {job.status === 'completed' && (
        <>
          <section className="card mt-6 p-6"><h2 className="text-base font-bold">Matched passages</h2>
            {matches.length === 0 ? <p className="mt-3 text-sm text-slate-600">{job.sources_compared === 0 ? 'No comparison sources were available. Documents you analyse later are compared against this one, and this one against earlier ones.' : 'No passages matched the documents compared.'}</p> : (
              <ul className="mt-4 space-y-4">{matches.map((m, i) => (
                <li key={i} className="rounded-lg border border-slate-200 p-4 text-sm"><mark className="bg-amber-100 px-1">{m.sentence}</mark>
                  <p className="mt-2 text-xs text-slate-500">Matches "{m.sourceTitle}" · {Math.round(m.overlap * 100)}% phrase overlap</p></li>))}</ul>)}
          </section>
          <section className="card mt-6 p-6 text-sm text-slate-600"><h2 className="text-base font-bold text-brand-navy">How this score is calculated</h2>
            <p className="mt-3">The text is normalised and split into sentences. Each sentence is broken into overlapping five word phrases and compared with phrases from each source. A sentence counts as matched when at least half of its phrases appear in one source. The similarity percentage is matched words divided by all words analysed, after your exclusions.</p>
            <p className="mt-3 font-medium text-brand-navy">Similarity is not plagiarism. Matches can be quotations, common phrases or properly cited material, and absence of matches does not prove originality. Only the sources listed above were compared. A person should review each match in context.</p></section>
        </>)}
    </>
  );
}
