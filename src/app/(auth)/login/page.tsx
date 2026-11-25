'use client';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell, Alert } from '@/components/AuthShell';
import { EMAIL_RE, safeNext } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/env';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const urlError = params.get('error');
  const banner = urlError === 'config' ? 'The application is missing its Supabase configuration.'
    : urlError === 'auth' ? 'That link is invalid or has expired. Please try again.' : null;
  const verified = params.get('verified') === '1';
  const reset = params.get('reset') === '1';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setUnconfirmed(false);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      if (/not confirmed/i.test(error.message)) { setUnconfirmed(true); return setError('Please verify your email address before signing in.'); }
      return setError(/invalid login/i.test(error.message) ? 'Incorrect email or password.' : error.message);
    }
    router.replace(safeNext(params.get('next')));
    router.refresh();
  }

  async function resend() {
    const { error } = await createClient().auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (error) setError(error.message); else { setError(null); setInfo('Verification email sent. Check your inbox.'); }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your TrueAuthor workspace.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {!isSupabaseConfigured && <Alert kind="error">Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</Alert>}
        {banner && <Alert kind="error">{banner}</Alert>}
        {verified && <Alert kind="success">Email verified. You can sign in now.</Alert>}
        {reset && <Alert kind="success">Password updated. Sign in with your new password.</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        {info && <Alert kind="success">{info}</Alert>}
        <div><label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" /></div>
        <div><div className="flex items-center justify-between"><label className="label" htmlFor="password">Password</label>
          <Link href="/forgot-password" className="mb-1.5 text-sm font-medium text-brand hover:underline">Forgot password?</Link></div>
          <input id="password" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        {unconfirmed && <button type="button" onClick={resend} className="btn-secondary w-full">Resend verification email</button>}
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">New to TrueAuthor? <Link href="/signup" className="font-semibold text-brand hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
