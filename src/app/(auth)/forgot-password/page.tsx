'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthShell, Alert } from '@/components/AuthShell';
import { EMAIL_RE } from '@/lib/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address.');
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  return (
    <AuthShell title="Reset your password" subtitle="We will email you a secure link to choose a new password.">
      {sent ? <Alert kind="success">If an account exists for {email}, a reset link is on its way.</Alert> : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error && <Alert kind="error">{error}</Alert>}
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link href="/login" className="font-semibold text-brand hover:underline">Back to sign in</Link></p>
    </AuthShell>
  );
}
