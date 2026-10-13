import { getPublicPageMetadata } from "@/shared/i18n/metadata";
import { HomeView } from "@/views/HomeView";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export const generateMetadata = async ({ params }: PageProps) =>
  getPublicPageMetadata((await params).locale, "home");
export default function HomePage() {
  return <HomeView />;
}
