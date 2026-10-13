import { useTranslations } from "next-intl";
import { PublicActionLink } from "@/components/ActionLink";
import { MasterOverview } from "@/components/MasterOverview";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import styles from "./AboutView.module.css";

export const AboutView = () => {
  const t = useTranslations("About");
  const common = useTranslations("Common");
  return (
    <>
      <PublicPageHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <PublicActionLink href="/booking">
              {common("bookOnline")}
            </PublicActionLink>
            <PublicActionLink href="/works" variant="secondary">
              {t("viewWorks")}
            </PublicActionLink>
          </>
        }
      />
      <section className={styles.overview} aria-labelledby="about-title">
        <PageContainer>
          <MasterOverview imageLoading="eager" />
        </PageContainer>
      </section>
    </>
  );
};
