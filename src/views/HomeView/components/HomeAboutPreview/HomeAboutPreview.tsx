import { MasterOverview } from "@/components/MasterOverview";
import { PageContainer } from "@/components/PageContainer";
import styles from "./HomeAboutPreview.module.css";

export const HomeAboutPreview = () => (
  <section id="about" className={styles.section} aria-labelledby="about-title">
    <PageContainer>
      <MasterOverview />
    </PageContainer>
  </section>
);
