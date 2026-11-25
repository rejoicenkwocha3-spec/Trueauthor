import { Footer, Nav } from '@/components/SiteChrome';
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (<><Nav /><main>{children}</main><Footer /></>);
}
