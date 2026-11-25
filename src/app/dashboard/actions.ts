'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { analyse, wordCount } from '@/lib/similarity';
import { isMissingTable, SETUP_MESSAGE } from '@/lib/dashboard';

export type FormState = { error?: string; ok?: string } | null;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_WORDS = 50000;

async function log(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, action: string, detail: string) {
  await supabase.from('ta_activity_logs').insert({ user_id: userId, action, detail });
}

export async function createAnalysis(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Your session has expired. Please sign in again.' };

  const title = String(form.get('title') ?? '').trim();
  let content = String(form.get('content') ?? '').trim();
  let sourceType: 'paste' | 'txt' = 'paste';
  const file = form.get('file');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) return { error: 'File is larger than 2 MB.' };
    if (!/\.txt$/i.test(file.name) || (file.type && file.type !== 'text/plain')) return { error: 'Only TXT files are supported right now. PDF and DOCX extraction is not available yet.' };
    content = (await file.text()).trim();
    sourceType = 'txt';
  }
  if (title.length < 1 || title.length > 200) return { error: 'Enter a title (up to 200 characters).' };
  if (content.length < 50) return { error: 'Provide at least 50 characters of text to analyse.' };
  const words = wordCount(content);
  if (words > MAX_WORDS) return { error: `Documents are limited to ${MAX_WORDS.toLocaleString()} words.` };
  const excludeQuotes = form.get('excludeQuotes') === 'on';
  const excludeReferences = form.get('excludeReferences') === 'on';

  const doc = await supabase.from('ta_documents').insert({ owner_id: user.id, title, content, source_type: sourceType, word_count: words }).select('id').single();
  if (doc.error) return { error: isMissingTable(doc.error) ? SETUP_MESSAGE : `Could not save the document: ${doc.error.message}` };

  const job = await supabase.from('ta_analysis_jobs').insert({ document_id: doc.data.id, owner_id: user.id, status: 'queued', options: { excludeQuotes, excludeReferences } }).select('id').single();
  if (job.error) return { error: `Could not queue the analysis: ${job.error.message}` };

  await supabase.from('ta_analysis_jobs').update({ status: 'processing' }).eq('id', job.data.id);
  try {
    // Authorised comparison set: the user's own previously stored documents.
    const others = await supabase.from('ta_documents').select('id,title,content').neq('id', doc.data.id).limit(200);
    if (others.error) throw new Error(others.error.message);
    const result = analyse(content, others.data ?? [], { excludeQuotes, excludeReferences });
    const upd = await supabase.from('ta_analysis_jobs').update({ status: 'completed', similarity_percent: result.percent, sources_compared: result.sourcesCompared, matches: result.matches, completed_at: new Date().toISOString() }).eq('id', job.data.id);
    if (upd.error) throw new Error(upd.error.message);
  } catch (e) {
    await supabase.from('ta_analysis_jobs').update({ status: 'failed', error: e instanceof Error ? e.message : 'Unknown error' }).eq('id', job.data.id);
  }
  await log(supabase, user.id, 'Analysis run', title);
  await supabase.from('ta_notifications').insert({ user_id: user.id, title: 'Analysis finished', body: `Report ready for "${title}".` });
  revalidatePath('/dashboard', 'layout');
  redirect(`/dashboard/reports/${job.data.id}`);
}

export async function deleteDocument(form: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const id = String(form.get('id') ?? '');
  const { error } = await supabase.from('ta_documents').delete().eq('id', id); // RLS limits this to the owner
  if (!error) await log(supabase, user.id, 'Document deleted', id);
  revalidatePath('/dashboard', 'layout');
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Your session has expired.' };
  const full_name = String(form.get('full_name') ?? '').trim();
  const institution = String(form.get('institution') ?? '').trim();
  const role = String(form.get('role') ?? 'student');
  if (full_name.length < 2) return { error: 'Enter your full name.' };
  if (!['student', 'lecturer', 'researcher', 'publisher', 'administrator', 'other'].includes(role)) return { error: 'Invalid role.' };
  const { error } = await supabase.from('ta_profiles').upsert({ id: user.id, email: user.email, full_name, institution, role, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  await supabase.auth.updateUser({ data: { full_name } });
  revalidatePath('/dashboard', 'layout');
  return { ok: 'Profile saved.' };
}

export async function markNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('ta_notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
  revalidatePath('/dashboard/notifications');
}
