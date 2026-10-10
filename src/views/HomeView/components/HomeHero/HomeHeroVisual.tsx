import Image from "next/image";
import styles from "./HomeHero.module.css";

export const HomeHeroVisual = () => {
  return (
    <div className={styles.visual}>
      <figure className={styles.photo}>
        <Image
          src="/images/lash-brow-closeup.jpg"
          alt="Выразительный взгляд: длинные ресницы и аккуратная форма бровей"
          className={styles.photoImage}
          fill
          preload
          sizes="(max-width: 767px) 420px, (max-width: 1023px) 45vw, 540px"
        />
        <figcaption className={styles.photoCaption}>
          Иллюстрация образа
        </figcaption>
      </figure>

      <div className={styles.sterilityCard}>
        <span className={styles.sterilityIcon} aria-hidden="true">
          ✨
        </span>
        <div>
          <p className={styles.sterilityTitle}>Стерильность</p>
          <p className={styles.sterilityDescription}>Одноразовые материалы</p>
        </div>
      </div>

      <div className={styles.experienceCard}>
        <p className={styles.experienceValue}>10 лет</p>
        <p className={styles.experienceLabel}>в красоте</p>
      </div>
    </div>
  );
};
