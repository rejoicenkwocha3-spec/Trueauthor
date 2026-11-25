import { requireUser } from '@/lib/dashboard';
import { PageHeader } from '@/components/ui';
import { ProfileForm } from '../_c/Forms';
export const metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';
export default async function Settings() {
  const { user, profile } = await requireUser();
  return (<><PageHeader title="Settings" subtitle="Manage your profile." />
    <ProfileForm defaults={{ full_name: profile?.full_name ?? (user.user_metadata?.full_name as string) ?? '', institution: profile?.institution ?? '', role: profile?.role ?? 'student', email: user.email ?? '' }} /></>);
}
