import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { GalleryCollection } from "@/features/gallery/components/GalleryCollection";
import { homeGalleryLimit } from "@/features/gallery/model/constants";
import { galleryContent } from "@/features/gallery/model/content";
import styles from "./HomeWorksPreview.module.css";

export const HomeWorksPreview = () => (
  <section id="works" className={styles.section} aria-labelledby="works-title">
    <PageContainer>
      <SectionHeading
        id="works-title"
        eyebrow="Портфолио"
        title="Работы"
        description={galleryContent.description}
      />
      <GalleryCollection query={{ limit: homeGalleryLimit }} />
    </PageContainer>
  </section>
);
