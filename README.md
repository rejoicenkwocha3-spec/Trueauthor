# TrueAuthor

Academic integrity and writing intelligence platform. Next.js 15, TypeScript, Tailwind, Supabase, Recharts.

## Setup with an existing Supabase project

1. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Project Settings > API).
2. In the Supabase SQL Editor run `supabase/migrations/0001_trueauthor_core.sql`. It is idempotent and every table is prefixed `ta_`, so other apps in the same project are untouched.
3. Authentication > URL Configuration: set Site URL to your deployed URL and add `http://localhost:3000/auth/callback` and `<your-url>/auth/callback` to Redirect URLs.
4. Authentication > Providers > Email: keep "Confirm email" on for verification. Optional: change the email templates to link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup` (and `type=recovery`) so links work across devices.
5. `npm install && npm run dev`

## Scripts

`npm run dev`, `npm run build`, `npm test` (similarity engine), `npm run typecheck`.

## Security

The service role key is never used in browser code. Row Level Security restricts every table to its owner. `SUPABASE_SERVICE_ROLE_KEY` is reserved for the future Selar webhook route and must stay server side.

## Status

Built: marketing site, auth, dashboard overview, documents, similarity analysis (TXT and pasted text), reports, settings, notifications.
Not built yet: PDF and DOCX extraction, PDF export, AI writing insights, authorship, citation and grammar tools, organisations and teams, Selar webhook. Unbuilt dashboard pages say so and show no simulated results.
