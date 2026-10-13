import { getPublicPageMetadata } from "@/shared/i18n/metadata";
import { WorksView } from "@/views/WorksView";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export const generateMetadata = async ({ params }: PageProps) =>
  getPublicPageMetadata((await params).locale, "works");
export default function WorksPage() {
  return <WorksView />;
}
