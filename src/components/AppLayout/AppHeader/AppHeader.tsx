import { ActionLink } from "@/components/ActionLink";
import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { AppHeaderNavigation } from "./AppHeaderNavigation";
import styles from "./AppHeader.module.css";

export const AppHeader = () => (
  <header className={styles.header}>
    <PageContainer className={styles.inner}>
      <StudioBrand />
      <AppHeaderNavigation />
      <ActionLink href="/booking" size="compact">
        Записаться
      </ActionLink>
    </PageContainer>
  </header>
);
