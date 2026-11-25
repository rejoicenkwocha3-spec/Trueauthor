import { requireUser, SETUP_MESSAGE } from '@/lib/dashboard';
import { Sidebar } from './_c/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, setupError } = await requireUser();
  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar name={profile?.full_name || (user.user_metadata?.full_name as string) || ''} email={user.email ?? ''} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {setupError && <div role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{SETUP_MESSAGE}</div>}
          {children}
        </div>
      </main>
    </div>
  );
}
