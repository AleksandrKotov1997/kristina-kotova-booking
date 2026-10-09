import type { ReactNode } from "react";
import { studioCity } from "@/features/studio/model/constants";
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
      <AppFooter city={studioCity} />
    </div>
  );
};
