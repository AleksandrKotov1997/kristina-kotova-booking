import styles from "./HomeHero.module.css";

export const HomeHeroVisual = () => {
  return (
    <div className={styles.visual}>
      <figure className={styles.photoPlaceholder}>
        <span className={styles.photoIcon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </span>
        <figcaption className={styles.photoCaption}>
          Фото работ мастера
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
