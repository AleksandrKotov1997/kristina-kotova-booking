import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMaster } from "@/server/auth/masterAccess";
import { authUnavailable } from "@/server/auth/authErrors";
import type { MasterProfile } from "@/features/auth/model/types";
import { LoginView } from "@/views/LoginView/LoginView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Вход для мастера",
  robots: { index: false, follow: false },
};

export default async function MasterLoginPage() {
  let master: MasterProfile | null = null;
  let initialError: string | undefined;
  try {
    master = await getCurrentMaster();
  } catch {
    initialError = authUnavailable().message;
  }
  if (master) redirect("/admin");
  return <LoginView initialError={initialError} />;
}
