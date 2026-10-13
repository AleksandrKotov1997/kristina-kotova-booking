import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getPathname } from "@/shared/i18n/navigation";
import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { AppHeaderControls } from "./AppHeaderControls";
import styles from "./AppHeader.module.css";

export const AppHeader = () => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  return (
    <header className={styles.header}>
      <PageContainer className={styles.inner}>
        <StudioBrand
          homeHref={getPathname({ locale, href: "/" })}
          homeLabel={t("brandHome")}
        />
        <AppHeaderControls />
      </PageContainer>
    </header>
  );
};
