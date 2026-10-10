import type { Metadata } from "next";
import { ServicesView } from "@/views/ServicesView";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Услуги Кристины Котовой в Астане: наращивание и ламинирование ресниц, оформление бровей. Цены в тенге и длительность процедур.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
