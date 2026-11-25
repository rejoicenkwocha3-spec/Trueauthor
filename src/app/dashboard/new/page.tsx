import { PageHeader } from '@/components/ui';
import { AnalysisForm } from '../_c/Forms';
export const metadata = { title: 'New Analysis' };
export default function NewAnalysis() {
  return (<><PageHeader title="New analysis" subtitle="Compare a document against the other documents in your workspace." /><AnalysisForm /></>);
}
