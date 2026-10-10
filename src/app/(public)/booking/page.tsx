import type { Metadata } from "next";
import { parseServiceSelectionRequest } from "@/features/services/model/serviceSelection";
import { BookingView } from "@/views/BookingView";

export const metadata: Metadata = {
  title: "Запись на процедуру",
  description:
    "Онлайн-запись на ресницы и брови к Кристине Котовой в Астане. Выберите услугу, дату и свободное время.",
};

interface BookingPageProps {
  searchParams: Promise<{ serviceId?: string | string[] }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;
  const selectionRequest = parseServiceSelectionRequest(serviceId);

  return <BookingView selectionRequest={selectionRequest} />;
}
