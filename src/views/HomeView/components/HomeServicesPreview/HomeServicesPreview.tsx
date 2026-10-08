import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { ServicesCatalog } from "@/features/services/components/ServicesCatalog";
import styles from "./HomeServicesPreview.module.css";

export const HomeServicesPreview = () => (
  <section
    id="services"
    className={styles.section}
    aria-labelledby="services-title"
  >
    <PageContainer>
      <SectionHeading
        id="services-title"
        eyebrow="Прайс-лист"
        title="Услуги"
        description="Профессиональный уход за ресницами и бровями. Индивидуальный подбор эффекта для каждого взгляда."
      />
      <ServicesCatalog />
    </PageContainer>
  </section>
);
