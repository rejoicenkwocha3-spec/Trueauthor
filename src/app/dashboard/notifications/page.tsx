import { requireUser } from '@/lib/dashboard';
import { Empty, PageHeader } from '@/components/ui';
import { markNotificationsRead } from '../actions';
export const metadata = { title: 'Notifications' };
export const dynamic = 'force-dynamic';
export default async function Notifications() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from('ta_notifications').select('*').order('created_at', { ascending: false }).limit(50);
  return (<><PageHeader title="Notifications" action={data?.some((n) => !n.read) ? <form action={markNotificationsRead}><button className="btn-secondary">Mark all read</button></form> : undefined} />
    {!data || data.length === 0 ? <Empty title="You are all caught up" body="Notifications about your analyses will appear here." /> : (
      <ul className="card divide-y divide-slate-100">{data.map((n) => (<li key={n.id} className="px-5 py-4 text-sm"><p className={`font-semibold text-brand-navy ${n.read ? 'opacity-60' : ''}`}>{n.title}</p><p className="text-slate-600">{n.body}</p><p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p></li>))}</ul>)}</>);
}
