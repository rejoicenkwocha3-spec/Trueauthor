'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell, Alert } from '@/components/AuthShell';
import { EMAIL_RE, passwordIssues } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/env';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    const issues = passwordIssues(password);
    if (issues.length) return setError(`Password needs ${issues.join(', ')}.`);
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(), password,
      options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) return setError(/registered|exists/i.test(error.message) ? 'An account with this email already exists. Try signing in.' : error.message);
    // Supabase returns a user with no identities when the email is already registered (anti enumeration).
    if (data.user && data.user.identities && data.user.identities.length === 0) return setError('An account with this email already exists. Try signing in.');
    if (data.session) { router.replace('/dashboard'); router.refresh(); return; }
    setSentTo(email.trim());
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your email" subtitle="One more step to activate your account.">
        <Alert kind="success">We sent a verification link to <strong>{sentTo}</strong>. Open it to confirm your address, then sign in.</Alert>
        <Link href="/login" className="btn-primary mt-6 w-full">Go to sign in</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Start evaluating originality and improving academic writing.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {!isSupabaseConfigured && <Alert kind="error">Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        <div><label className="label" htmlFor="name">Full name</label><input id="name" autoComplete="name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="mt-1.5 text-xs text-slate-500">At least 8 characters with upper case, lower case and a number.</p></div>
        <div><label className="label" htmlFor="confirm">Confirm password</label><input id="confirm" type="password" autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}
