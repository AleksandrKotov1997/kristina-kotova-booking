import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { ServicesCatalog } from "@/features/services/components/ServicesCatalog";
import styles from "./ServicesView.module.css";

export const ServicesView = () => (
  <>
    <PublicPageHeading
      eyebrow="Прайс-лист"
      title="Услуги"
      description="Наращивание и ламинирование ресниц, архитектура и ламинирование бровей. Подберите процедуру для своего взгляда."
    />
    <section className={styles.catalog} aria-label="Каталог услуг">
      <PageContainer>
        <ServicesCatalog serviceHeadingLevel={2} />
      </PageContainer>
    </section>
  </>
);
