import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { ServicesCatalog } from "@/features/services/components/ServicesCatalog";
import styles from "./HomeServicesPreview.module.css";

export const HomeServicesPreview = () => {
  const t = useTranslations("Services");
  return (
    <section
      id="services"
      className={styles.section}
      aria-labelledby="services-title"
    >
      <PageContainer>
        <SectionHeading
          id="services-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("homeDescription")}
        />
        <ServicesCatalog />
      </PageContainer>
    </section>
  );
};
