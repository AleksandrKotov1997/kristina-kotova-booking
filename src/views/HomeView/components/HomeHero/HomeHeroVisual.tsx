import { useTranslations } from "next-intl";
import Image from "next/image";
import styles from "./HomeHero.module.css";

export const HomeHeroVisual = () => {
  const t = useTranslations("Hero");
  return (
    <div className={styles.visual}>
      <figure className={styles.photo}>
        <Image
          src="/images/lash-brow-closeup.jpg"
          alt={t("photoAlt")}
          className={styles.photoImage}
          fill
          preload
          sizes="(max-width: 767px) 420px, (max-width: 1023px) 45vw, 540px"
        />
        <figcaption className={styles.photoCaption}>
          {t("photoCaption")}
        </figcaption>
      </figure>

      <div className={styles.sterilityCard}>
        <span className={styles.sterilityIcon} aria-hidden="true">
          ✨
        </span>
        <div>
          <p className={styles.sterilityTitle}>{t("sterility")}</p>
          <p className={styles.sterilityDescription}>{t("materials")}</p>
        </div>
      </div>

      <div className={styles.experienceCard}>
        <p className={styles.experienceValue}>{t("beautyYears")}</p>
        <p className={styles.experienceLabel}>{t("beauty")}</p>
      </div>
    </div>
  );
};
