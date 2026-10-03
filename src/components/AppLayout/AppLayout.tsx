import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.content}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
};
