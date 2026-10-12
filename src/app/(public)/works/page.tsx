import type { Metadata } from "next";
import { galleryContent } from "@/features/gallery/model/content";
import { WorksView } from "@/views/WorksView";

export const metadata: Metadata = {
  title: "Работы",
  description: galleryContent.description,
};

export default function WorksPage() {
  return <WorksView />;
}
