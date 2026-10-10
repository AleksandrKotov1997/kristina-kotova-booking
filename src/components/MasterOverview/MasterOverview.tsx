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
}: MasterOverviewProps) => (
  <div className={styles.layout}>
    <div>
      <figure className={styles.figure}>
        <div className={styles.photo}>
          <Image
            src="/images/master-treatment.jpg"
            alt="Мастер в перчатках аккуратно наращивает ресницы клиентке"
            className={styles.image}
            fill
            loading={imageLoading}
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 45vw, 420px"
          />
        </div>
        <figcaption className={styles.caption}>
          Иллюстрация процедуры
        </figcaption>
      </figure>
      <MasterIntroduction headingId="about-title" />
    </div>
    <div className={styles.benefits}>
      <SectionEyebrow alignment="start">Почему выбирают меня</SectionEyebrow>
      <h2 className={styles.title} id="benefits-title">
        Моя <em>работа — ваш взгляд</em>
      </h2>
      <ul className={styles.benefitGrid} aria-labelledby="benefits-title">
        {masterBenefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
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
        <p>
          Сертификаты ведущих школ · Постоянное обучение · Качественные
          материалы
        </p>
      </div>
    </div>
  </div>
);
