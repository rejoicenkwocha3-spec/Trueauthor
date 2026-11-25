'use client';
import { useActionState } from 'react';
import { createAnalysis, updateProfile, type FormState } from '../actions';
import { Alert } from '@/components/AuthShell';

export function AnalysisForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createAnalysis, null);
  return (
    <form action={action} className="card max-w-3xl space-y-5 p-6">
      {state?.error && <Alert kind="error">{state.error}</Alert>}
      <div><label className="label" htmlFor="title">Document title</label><input id="title" name="title" required maxLength={200} className="input" placeholder="Essay on climate policy" /></div>
      <div><label className="label" htmlFor="content">Paste text</label><textarea id="content" name="content" rows={10} className="input font-mono" placeholder="Paste the document text here" /></div>
      <div><label className="label" htmlFor="file">Or upload a TXT file (max 2 MB)</label><input id="file" name="file" type="file" accept=".txt,text/plain" className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-brand-bg file:px-4 file:py-2 file:font-semibold file:text-brand-navy" />
        <p className="mt-1.5 text-xs text-slate-500">If both are provided the file is used. PDF and DOCX extraction is not available yet.</p></div>
      <fieldset className="space-y-2"><legend className="label">Exclusions</legend>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="excludeReferences" defaultChecked /> Exclude references and bibliography</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="excludeQuotes" /> Exclude quoted text</label></fieldset>
      <p className="rounded-lg bg-brand-bg p-3 text-xs text-slate-600">The document is compared only with documents you have already stored in TrueAuthor. A similarity score is not a finding of plagiarism: matching text may be properly quoted or cited.</p>
      <button className="btn-primary" disabled={pending}>{pending ? 'Analysing...' : 'Run analysis'}</button>
    </form>
  );
}

export function ProfileForm({ defaults }: { defaults: { full_name: string; institution: string; role: string; email: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, null);
  return (
    <form action={action} className="card max-w-xl space-y-5 p-6">
      {state?.error && <Alert kind="error">{state.error}</Alert>}
      {state?.ok && <Alert kind="success">{state.ok}</Alert>}
      <div><label className="label">Email</label><input className="input bg-slate-50" value={defaults.email} disabled readOnly /></div>
      <div><label className="label" htmlFor="full_name">Full name</label><input id="full_name" name="full_name" required defaultValue={defaults.full_name} className="input" /></div>
      <div><label className="label" htmlFor="institution">Institution</label><input id="institution" name="institution" defaultValue={defaults.institution} className="input" /></div>
      <div><label className="label" htmlFor="role">Role</label>
        <select id="role" name="role" defaultValue={defaults.role} className="input">{['student', 'lecturer', 'researcher', 'publisher', 'administrator', 'other'].map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}</select></div>
      <button className="btn-primary" disabled={pending}>{pending ? 'Saving...' : 'Save changes'}</button>
    </form>
  );
}
