import type { Metadata } from "next";
import { requireMaster } from "@/server/auth/masterAccess";
import { MasterAccountView } from "@/views/MasterAccountView/MasterAccountView";

export const metadata: Metadata = {
  title: "Кабинет мастера",
  robots: { index: false, follow: false },
};

export default async function MasterAccountPage() {
  const master = await requireMaster();
  return <MasterAccountView master={master} />;
}
