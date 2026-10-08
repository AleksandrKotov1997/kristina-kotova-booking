import { ActionLink } from "@/components/ActionLink";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { GalleryCollection } from "@/features/gallery/components/GalleryCollection";
import { galleryContent } from "@/features/gallery/model/content";
import styles from "./WorksView.module.css";

export const WorksView = () => (
  <>
    <PublicPageHeading
      eyebrow="Портфолио"
      title="Работы"
      description={galleryContent.description}
      actions={<ActionLink href="/booking">Записаться онлайн</ActionLink>}
    />
    <section className={styles.gallery} aria-label="Галерея ресниц и бровей">
      <PageContainer>
        <GalleryCollection />
      </PageContainer>
    </section>
  </>
);
