import { studioCity } from "@/features/studio/model/constants";
import { ActionLink } from "@/components/ActionLink";
import { PageContainer } from "@/components/PageContainer";
import { HomeHeroVisual } from "./HomeHeroVisual";
import styles from "./HomeHero.module.css";

const heroStatistics = [
  { value: "500+", label: "Довольных клиентов" },
  { value: "3 года", label: "Опыт работы" },
  { value: "5★", label: "Рейтинг мастера" },
];

export const HomeHero = () => {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <PageContainer className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.badge}>{studioCity} · Ресницы и брови</p>

          <h1 className={styles.title} id="home-hero-title">
            <span>Ресницы, которые</span> <em>говорят за вас</em>
          </h1>

          <p className={styles.description}>
            Наращивание, ламинирование, коррекция и снятие ресниц. Архитектура и
            ламинирование бровей. Индивидуальный подбор эффекта для каждого
            взгляда.
          </p>

          <div className={styles.actions}>
            <ActionLink href="/booking">Записаться онлайн</ActionLink>
            <ActionLink href="/services" variant="secondary">
              Посмотреть услуги
            </ActionLink>
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
