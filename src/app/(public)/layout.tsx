import type { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return <AppLayout>{children}</AppLayout>;
}
