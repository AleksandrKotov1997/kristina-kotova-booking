import type { Metadata } from "next";
import { requireMaster } from "@/server/auth/masterAccess";
import { AdminDashboardView } from "@/views/AdminDashboardView/AdminDashboardView";
export const metadata: Metadata = {
  title: "Кабинет мастера",
  robots: { index: false, follow: false },
};
export default async function AdminDashboardPage() {
  await requireMaster();
  return <AdminDashboardView />;
}
