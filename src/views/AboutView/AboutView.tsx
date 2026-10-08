import { ActionLink } from "@/components/ActionLink";
import { MasterOverview } from "@/components/MasterOverview";
import { PageContainer } from "@/components/PageContainer";
import { PublicPageHeading } from "@/components/PublicPageHeading";
import styles from "./AboutView.module.css";

export const AboutView = () => (
  <>
    <PublicPageHeading
      eyebrow="Знакомство"
      title="О мастере"
      description="Кристина Котова — мастер по ресницам и бровям. Аккуратная работа, индивидуальный подбор эффекта и комфорт на каждой процедуре."
      actions={
        <>
          <ActionLink href="/booking">Записаться онлайн</ActionLink>
          <ActionLink href="/works" variant="secondary">
            Посмотреть работы
          </ActionLink>
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
