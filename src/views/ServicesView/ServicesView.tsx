import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { ServicesCatalog } from "@/features/services/components/ServicesCatalog";
import styles from "./ServicesView.module.css";

export const ServicesView = () => {
  const t = useTranslations("Services");
  return (
    <>
      <PublicPageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className={styles.catalog} aria-label={t("catalogLabel")}>
        <PageContainer>
          <ServicesCatalog serviceHeadingLevel={2} />
        </PageContainer>
      </section>
    </>
  );
};
