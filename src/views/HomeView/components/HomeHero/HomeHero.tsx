import { useTranslations } from "next-intl";
import { PublicActionLink } from "@/components/ActionLink";
import { PageContainer } from "@/components/PageContainer";
import { HomeHeroVisual } from "./HomeHeroVisual";
import styles from "./HomeHero.module.css";

export const HomeHero = () => {
  const t = useTranslations("Hero");
  const common = useTranslations("Common");
  const heroStatistics = [
    { value: "500+", label: t("clients") },
    { value: t("experienceValue"), label: t("experience") },
    { value: "5★", label: t("rating") },
  ];
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <PageContainer className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.badge}>{t("badge")}</p>

          <h1 className={styles.title} id="home-hero-title">
            <span>{t("title")}</span> <em>{t("accent")}</em>
          </h1>

          <p className={styles.description}>{t("description")}</p>

          <div className={styles.actions}>
            <PublicActionLink href="/booking">
              {common("bookOnline")}
            </PublicActionLink>
            <PublicActionLink href="/services" variant="secondary">
              {t("viewServices")}
            </PublicActionLink>
          </div>

          <dl className={styles.statistics}>
            {heroStatistics.map((statistic) => (
              <div className={styles.statistic} key={statistic.label}>
                <dt className={styles.statisticLabel}>{statistic.label}</dt>
                <dd className={styles.statisticValue}>{statistic.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HomeHeroVisual />
      </PageContainer>
    </section>
  );
};
