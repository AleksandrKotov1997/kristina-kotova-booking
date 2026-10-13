import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { GalleryCollection } from "@/features/gallery/components/GalleryCollection";
import { homeGalleryLimit } from "@/features/gallery/model/constants";
import styles from "./HomeWorksPreview.module.css";

export const HomeWorksPreview = () => {
  const t = useTranslations("Gallery");
  return (
    <section
      id="works"
      className={styles.section}
      aria-labelledby="works-title"
    >
      <PageContainer>
        <SectionHeading
          id="works-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <GalleryCollection query={{ limit: homeGalleryLimit }} />
      </PageContainer>
    </section>
  );
};
