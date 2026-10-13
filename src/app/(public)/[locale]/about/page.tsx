import { getPublicPageMetadata } from "@/shared/i18n/metadata";
import { AboutView } from "@/views/AboutView";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export const generateMetadata = async ({ params }: PageProps) =>
  getPublicPageMetadata((await params).locale, "about");
export default function AboutPage() {
  return <AboutView />;
}
