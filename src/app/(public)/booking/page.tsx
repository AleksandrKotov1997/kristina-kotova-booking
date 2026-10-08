import type { Metadata } from "next";
import { BookingView } from "@/views/BookingView";

export const metadata: Metadata = {
  title: "Запись на процедуру",
  description:
    "Онлайн-запись к Кристине Котовой на услуги для ресниц и бровей.",
};

export default function BookingPage() {
  return <BookingView />;
}
