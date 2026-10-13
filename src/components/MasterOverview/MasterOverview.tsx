import { useTranslations } from "next-intl";
import Image from "next/image";
import { BenefitCard } from "@/components/BenefitCard";
import { MasterIntroduction } from "@/components/MasterIntroduction";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { masterBenefits } from "@/features/master/model/content";
import styles from "./MasterOverview.module.css";

interface MasterOverviewProps {
  imageLoading?: "eager" | "lazy";
}

export const MasterOverview = ({
  imageLoading = "lazy",
}: MasterOverviewProps) => {
  const t = useTranslations("About");
  return (
    <div className={styles.layout}>
      <div>
        <figure className={styles.figure}>
          <div className={styles.photo}>
            <Image
              src="/images/master-treatment.jpg"
              alt={t("photoAlt")}
              className={styles.image}
              fill
              loading={imageLoading}
              sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 45vw, 420px"
            />
          </div>
          <figcaption className={styles.caption}>
            {t("photoCaption")}
          </figcaption>
        </figure>
        <MasterIntroduction headingId="about-title" />
      </div>
      <div className={styles.benefits}>
        <SectionEyebrow alignment="start">{t("why")}</SectionEyebrow>
        <h2 className={styles.title} id="benefits-title">
          {t("work")} <em>{t("workAccent")}</em>
        </h2>
        <ul className={styles.benefitGrid} aria-labelledby="benefits-title">
          {masterBenefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={{
                ...benefit,
                title: t(`benefits.${benefit.id}.title`),
                description: t(`benefits.${benefit.id}.description`),
              }}
            />
          ))}
        </ul>
        <div className={styles.qualifications}>
          <svg
            className={styles.checkIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
            <polyline points="22 4 12 14 9 11" />
          </svg>
          <p>{t("qualifications")}</p>
        </div>
      </div>
    </div>
  );
};
