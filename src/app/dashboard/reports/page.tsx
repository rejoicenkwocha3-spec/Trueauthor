import Link from 'next/link';
import { requireUser } from '@/lib/dashboard';
import { Empty, PageHeader, StatusBadge } from '@/components/ui';
export const metadata = { title: 'Similarity Reports' };
export const dynamic = 'force-dynamic';

export default async function Reports() {
  const { supabase } = await requireUser();
  const { data: jobs } = await supabase.from('ta_analysis_jobs').select('id,reference,status,similarity_percent,created_at,ta_documents(title)').order('created_at', { ascending: false });
  return (
    <>
      <PageHeader title="Similarity reports" subtitle="Every analysis with its status and result." />
      {!jobs || jobs.length === 0 ? <Empty title="No reports yet" body="Run an analysis to generate your first report." href="/dashboard/new" cta="New analysis" /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Document</th><th className="px-5 py-3">Similarity</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{jobs.map((j) => {
            const doc = j.ta_documents as unknown as { title: string } | null;
            return (<tr key={j.id}><td className="px-5 py-3"><Link href={`/dashboard/reports/${j.id}`} className="font-semibold text-brand hover:underline">{j.reference}</Link></td><td className="px-5 py-3">{doc?.title ?? 'Deleted document'}</td>
              <td className="px-5 py-3 font-semibold">{j.status === 'completed' ? `${Number(j.similarity_percent)}%` : '-'}</td><td className="px-5 py-3"><StatusBadge status={j.status} /></td><td className="px-5 py-3">{new Date(j.created_at).toLocaleDateString()}</td></tr>);
          })}</tbody></table></div>)}
    </>
  );
}
