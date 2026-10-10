import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { AppHeaderControls } from "./AppHeaderControls";
import styles from "./AppHeader.module.css";

export const AppHeader = () => (
  <header className={styles.header}>
    <PageContainer className={styles.inner}>
      <StudioBrand />
      <AppHeaderControls />
    </PageContainer>
  </header>
);
