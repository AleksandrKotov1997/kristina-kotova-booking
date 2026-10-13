import { getPublicPageMetadata } from "@/shared/i18n/metadata";
import { ServicesView } from "@/views/ServicesView";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export const generateMetadata = async ({ params }: PageProps) =>
  getPublicPageMetadata((await params).locale, "services");
export default function ServicesPage() {
  return <ServicesView />;
}
