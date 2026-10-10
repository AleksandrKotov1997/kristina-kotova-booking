import type { Metadata } from "next";
import { AboutView } from "@/views/AboutView";

export const metadata: Metadata = {
  title: "О мастере",
  description:
    "Кристина Котова — мастер по ресницам и бровям в Астане. Индивидуальный подбор эффекта, аккуратная работа и комфорт на процедуре.",
};

export default function AboutPage() {
  return <AboutView />;
}
