import Link from 'next/link';
import { requireUser } from '@/lib/dashboard';
import { Empty, PageHeader } from '@/components/ui';
import { deleteDocument } from '../actions';
export const metadata = { title: 'My Documents' };
export const dynamic = 'force-dynamic';

export default async function Documents() {
  const { supabase } = await requireUser();
  const { data: docs } = await supabase.from('ta_documents').select('id,title,word_count,source_type,created_at').order('created_at', { ascending: false });
  return (
    <>
      <PageHeader title="My documents" subtitle="Documents you have submitted for analysis." action={<Link href="/dashboard/new" className="btn-primary">New analysis</Link>} />
      {!docs || docs.length === 0 ? <Empty title="No documents yet" body="Documents you analyse are stored here and used as comparison sources for future analyses." href="/dashboard/new" cta="Add a document" /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Words</th><th className="px-5 py-3">Added</th><th className="px-5 py-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{docs.map((d) => (
            <tr key={d.id}><td className="px-5 py-3 font-medium text-brand-navy">{d.title}</td><td className="px-5 py-3 uppercase">{d.source_type}</td><td className="px-5 py-3">{d.word_count}</td><td className="px-5 py-3">{new Date(d.created_at).toLocaleDateString()}</td>
              <td className="px-5 py-3 text-right"><form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><button className="text-sm font-semibold text-red-600 hover:underline">Delete</button></form></td></tr>))}</tbody>
        </table></div>)}
    </>
  );
}
