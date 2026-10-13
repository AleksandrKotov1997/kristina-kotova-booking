import { getPublicPageMetadata } from "@/shared/i18n/metadata";
import { BookingView } from "@/views/BookingView";
import { parseServiceSelectionRequest } from "@/features/services/model/serviceSelection";
interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ serviceId?: string | string[] }>;
}
export const generateMetadata = async ({ params }: PageProps) =>
  getPublicPageMetadata((await params).locale, "booking");
export default async function BookingPage({ searchParams }: PageProps) {
  const selectionRequest = parseServiceSelectionRequest(
    (await searchParams).serviceId,
  );
  return <BookingView selectionRequest={selectionRequest} />;
}
