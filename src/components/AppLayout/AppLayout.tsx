import type { ReactNode } from "react";
import { studioContacts } from "@/features/studio/model/contacts";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.content}>{children}</main>
      <AppFooter city={studioContacts.location?.city} />
    </div>
  );
};
