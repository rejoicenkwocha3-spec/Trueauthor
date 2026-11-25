import Link from 'next/link';
import { requireUser } from '@/lib/dashboard';
import { PageHeader } from '@/components/ui';
export const metadata = { title: 'Billing' };
export const dynamic = 'force-dynamic';
export default async function Billing() {
  const { supabase } = await requireUser();
  const { data: sub } = await supabase.from('ta_subscriptions').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1).maybeSingle();
  return (<><PageHeader title="Billing" subtitle="Your subscription status." />
    <div className="card max-w-xl p-6">{sub ? (<><p className="text-sm text-slate-500">Active plan</p><p className="mt-1 font-display text-2xl font-extrabold">{sub.plan}</p></>) : (<><p className="font-semibold text-brand-navy">No active subscription</p><p className="mt-2 text-sm text-slate-600">A subscription is activated only after Selar confirms your payment. Clicking a checkout button alone does not activate a plan.</p><Link href="/pricing" className="btn-primary mt-5">View plans</Link></>)}</div></>);
}
