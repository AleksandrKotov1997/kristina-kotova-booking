import type { Metadata } from "next";
import { AboutView } from "@/views/AboutView";

export const metadata: Metadata = {
  title: "О мастере",
  description:
    "Знакомство с Кристиной Котовой: подход к работе, уход за ресницами и бровями, комфорт на процедуре.",
};

export default function AboutPage() {
  return <AboutView />;
}
