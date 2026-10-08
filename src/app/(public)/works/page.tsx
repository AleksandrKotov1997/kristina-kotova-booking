import type { Metadata } from "next";
import { WorksView } from "@/views/WorksView";

export const metadata: Metadata = {
  title: "Работы",
  description:
    "Галерея ресниц и бровей: идеи образов, наращивание и ламинирование, архитектура бровей.",
};

export default function WorksPage() {
  return <WorksView />;
}
