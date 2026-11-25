import { Empty, PageHeader } from '@/components/ui';
export default async function ComingSoon({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  const name = (f ?? 'This feature').slice(0, 60).replace(/[^\w\s]/g, '');
  return (<><PageHeader title={name} /><Empty title="Not available yet" body={`${name} is not built yet, so no results are shown. Nothing on this page is simulated.`} href="/dashboard/new" cta="Run a similarity analysis" /></>);
}
