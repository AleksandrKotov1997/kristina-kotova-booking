import type { Metadata } from "next";
import { ServicesView } from "@/views/ServicesView";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Услуги для ресниц и бровей: наращивание, ламинирование, коррекция, снятие и архитектура бровей.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
