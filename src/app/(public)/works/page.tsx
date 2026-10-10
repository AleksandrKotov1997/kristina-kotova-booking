import type { Metadata } from "next";
import { WorksView } from "@/views/WorksView";

export const metadata: Metadata = {
  title: "Работы",
  description:
    "Ресницы и брови крупным планом: идеи образов и иллюстрации процедур студии Кристины Котовой в Астане.",
};

export default function WorksPage() {
  return <WorksView />;
}
