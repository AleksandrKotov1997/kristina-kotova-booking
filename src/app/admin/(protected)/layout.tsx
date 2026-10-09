import type { ReactNode } from "react";
import { AdminLayout } from "@/components/AdminLayout/AdminLayout";
import { requireMaster } from "@/server/auth/masterAccess";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireMaster();
  return <AdminLayout>{children}</AdminLayout>;
}
