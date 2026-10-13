import { useTranslations } from "next-intl";
import { PublicActionLink } from "@/components/ActionLink";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import { GalleryCollection } from "@/features/gallery/components/GalleryCollection";
import styles from "./WorksView.module.css";

export const WorksView = () => {
  const t = useTranslations("Gallery");
  const common = useTranslations("Common");
  return (
    <>
      <PublicPageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <PublicActionLink href="/booking">
            {common("bookOnline")}
          </PublicActionLink>
        }
      />
      <section className={styles.gallery} aria-label={t("label")}>
        <PageContainer>
          <GalleryCollection />
        </PageContainer>
      </section>
    </>
  );
};
