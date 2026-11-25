import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Token hash flow: works when the email link is opened on a different device or browser.
// Point the Supabase email templates at {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup (or recovery).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      if (type === 'recovery') return NextResponse.redirect(`${origin}/reset-password`);
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?verified=1`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
