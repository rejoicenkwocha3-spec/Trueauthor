'use client';
import { useState } from 'react';
import { analyse } from '@/lib/similarity';

const SOURCE = 'Rising seas threaten coastal cities every single year and researchers urge immediate policy action.';
const SAMPLE = 'Climate change is accelerating across the globe. Rising seas threaten coastal cities every single year and researchers urge immediate policy action. Local councils are drafting new flood plans.';

export function Demo() {
  const [text, setText] = useState(SAMPLE);
  const [ran, setRan] = useState(true);
  const r = analyse(text, [{ id: 'sample', title: 'Sample source document', content: SOURCE }]);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5">
        <label htmlFor="demo" className="label">Sample submission (editable)</label>
        <textarea id="demo" rows={7} className="input" value={text} onChange={(e) => { setText(e.target.value); setRan(false); }} />
        <button className="btn-primary mt-4" onClick={() => setRan(true)}>Analyse</button>
        <p className="mt-3 text-xs text-slate-500">Compared against one sample source: "{SOURCE}"</p>
      </div>
      <div className="card p-5">
        {!ran ? <p className="text-sm text-slate-500">Press Analyse to generate the report.</p> : (
          <>
            <p className="text-sm text-slate-500">Similarity</p>
            <p className="font-display text-5xl font-extrabold text-brand-navy">{r.percent}%</p>
            <div className="mt-4 space-y-2 text-sm">
              {r.matches.length === 0 ? <p className="text-slate-600">No passages matched the sample source.</p> : r.matches.map((m, i) => <p key={i}><mark className="bg-amber-100 px-1">{m.sentence}</mark></p>)}
            </div>
            <p className="mt-4 text-xs text-slate-500">Similarity is not plagiarism. Matches need human review.</p>
          </>)}
      </div>
    </div>
  );
}
