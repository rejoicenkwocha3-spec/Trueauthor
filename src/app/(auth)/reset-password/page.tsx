'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthShell, Alert } from '@/components/AuthShell';
import { passwordIssues } from '@/lib/validation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { createClient().auth.getUser().then(({ data }) => setReady(Boolean(data.user))); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const issues = passwordIssues(password);
    if (issues.length) return setError(`Password needs ${issues.join(', ')}.`);
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setLoading(false); return setError(error.message); }
    await supabase.auth.signOut();
    router.replace('/login?reset=1');
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Use a strong password you have not used elsewhere.">
      {ready === null ? <p className="text-sm text-slate-500">Checking your reset link...</p>
        : ready === false ? (<><Alert kind="error">This reset link is invalid or has expired.</Alert><Link href="/forgot-password" className="btn-primary mt-6 w-full">Request a new link</Link></>)
        : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {error && <Alert kind="error">{error}</Alert>}
            <div><label className="label" htmlFor="password">New password</label><input id="password" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <div><label className="label" htmlFor="confirm">Confirm new password</label><input id="confirm" type="password" autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
          </form>
        )}
    </AuthShell>
  );
}
