import Link from 'next/link';
import { requireUser } from '@/lib/dashboard';
import { Empty, PageHeader, StatusBadge } from '@/components/ui';
import { MonthlyChart, StatusChart } from './_c/Charts';

export const metadata = { title: 'Overview' };
export const dynamic = 'force-dynamic';

export default async function Overview() {
  const { supabase, user, profile } = await requireUser();
  const [docsRes, jobsRes, actRes] = await Promise.all([
    supabase.from('ta_documents').select('id,title,word_count,created_at').order('created_at', { ascending: false }),
    supabase.from('ta_analysis_jobs').select('id,document_id,status,similarity_percent,created_at').order('created_at', { ascending: false }),
    supabase.from('ta_activity_logs').select('id,action,detail,created_at').order('created_at', { ascending: false }).limit(8),
  ]);
  const docs = docsRes.data ?? [];
  const jobs = jobsRes.data ?? [];
  const activity = actRes.data ?? [];

  const now = new Date();
  const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const thisMonth = jobs.filter((j) => monthKey(new Date(j.created_at)) === monthKey(now)).length;
  const completed = jobs.filter((j) => j.status === 'completed');
  const pending = jobs.filter((j) => j.status === 'queued' || j.status === 'processing').length;
  const scores = completed.map((j) => Number(j.similarity_percent)).filter((n) => !Number.isNaN(n));
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) + '%' : 'No data';

  const months = Array.from({ length: 6 }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1); return { key: monthKey(d), month: d.toLocaleString('en', { month: 'short' }), documents: 0 }; });
  jobs.forEach((j) => { const m = months.find((x) => x.key === monthKey(new Date(j.created_at))); if (m) m.documents++; });
  const statusData = ['completed', 'processing', 'queued', 'failed'].map((s) => ({ name: s, value: jobs.filter((j) => j.status === s).length })).filter((x) => x.value > 0);
  const titleOf = new Map(docs.map((d) => [d.id, d.title]));

  const stats = [
    ['Documents analysed', String(jobs.length)], ['Average similarity', avg], ['Analysed this month', String(thisMonth)],
    ['Completed reports', String(completed.length)], ['Pending analyses', String(pending)],
  ];
  const first = (profile?.full_name || (user.user_metadata?.full_name as string) || '').split(' ')[0];

  return (
    <>
      <PageHeader title={first ? `Welcome back, ${first}` : 'Overview'} subtitle="Your writing integrity activity at a glance." action={<Link href="/dashboard/new" className="btn-primary">New analysis</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 font-display text-3xl font-extrabold text-brand-navy">{value}</p></div>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="mt-8"><Empty title="No analyses yet" body="Paste text or upload a TXT file to run your first similarity analysis. Results will appear here." href="/dashboard/new" cta="Start an analysis" /></div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2"><h2 className="mb-4 text-base font-bold">Analyses per month</h2><MonthlyChart data={months} /></div>
          <div className="card p-6"><h2 className="mb-4 text-base font-bold">Status breakdown</h2><StatusChart data={statusData} />
            <ul className="mt-2 space-y-1 text-sm">{statusData.map((s) => <li key={s.name} className="flex justify-between capitalize"><span>{s.name}</span><span className="font-semibold">{s.value}</span></li>)}</ul></div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6"><h2 className="mb-4 text-base font-bold">Recent documents</h2>
          {docs.length === 0 ? <p className="text-sm text-slate-500">No documents yet.</p> : (
            <ul className="divide-y divide-slate-100">{docs.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3 text-sm"><span className="truncate font-medium text-brand-navy">{d.title}</span><span className="ml-4 shrink-0 text-slate-500">{d.word_count} words</span></li>))}</ul>)}
        </section>
        <section className="card p-6"><h2 className="mb-4 text-base font-bold">Recent activity</h2>
          {activity.length === 0 ? <p className="text-sm text-slate-500">Activity will appear here.</p> : (
            <ul className="divide-y divide-slate-100">{activity.map((a) => (
              <li key={a.id} className="py-3 text-sm"><p className="font-medium text-brand-navy">{a.action}</p><p className="text-slate-500">{a.detail} · {new Date(a.created_at).toLocaleString()}</p></li>))}</ul>)}
        </section>
      </div>
      {jobs.length > 0 && (
        <section className="card mt-6 p-6"><h2 className="mb-4 text-base font-bold">Recent reports</h2>
          <ul className="divide-y divide-slate-100">{jobs.slice(0, 5).map((j) => (
            <li key={j.id} className="flex items-center justify-between py-3 text-sm"><Link href={`/dashboard/reports/${j.id}`} className="truncate font-medium text-brand hover:underline">{titleOf.get(j.document_id) ?? 'Deleted document'}</Link>
              <span className="ml-4 flex shrink-0 items-center gap-3">{j.status === 'completed' && <span className="font-semibold">{Number(j.similarity_percent)}%</span>}<StatusBadge status={j.status} /></span></li>))}</ul></section>
      )}
    </>
  );
}
