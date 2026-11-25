import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type Profile = { id: string; email: string | null; full_name: string | null; institution: string | null; role: string };

/** Returns the signed in user and profile. Creates the profile lazily so sign in never depends on a DB trigger. */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  let profile: Profile | null = null;
  let setupError = false;
  const { data, error } = await supabase.from('ta_profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) setupError = isMissingTable(error);
  else if (data) profile = data as Profile;
  else {
    const ins = await supabase.from('ta_profiles').insert({ id: user.id, email: user.email, full_name: (user.user_metadata?.full_name as string) ?? '' }).select().single();
    if (ins.data) profile = ins.data as Profile;
  }
  return { supabase, user, profile, setupError };
}

export function isMissingTable(error: { code?: string; message?: string }) {
  return error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '');
}

export const SETUP_MESSAGE = 'The TrueAuthor database tables are not installed in this Supabase project yet. Run supabase/migrations/0001_trueauthor_core.sql in the Supabase SQL Editor.';
