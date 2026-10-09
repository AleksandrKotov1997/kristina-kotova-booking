import type { ReactNode } from "react";
import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { LogoutButton } from "@/features/auth/components/LogoutButton/LogoutButton";
import { AdminNavigation } from "./AdminNavigation";
import styles from "./AdminLayout.module.css";

export const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.layout}>
    <header className={styles.header}>
      <PageContainer className={styles.headerContent}>
        <StudioBrand />
        <div className={styles.controls}>
          <AdminNavigation />
          <LogoutButton />
        </div>
      </PageContainer>
    </header>
    <main className={styles.main}>
      <PageContainer>{children}</PageContainer>
    </main>
  </div>
);
