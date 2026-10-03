import Link from "next/link";
import Image from "next/image";
import { AppHeaderNavigation } from "./AppHeaderNavigation";
import styles from "./AppHeader.module.css";

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Kristina Kotova — на главную"
        >
          <Image
            src="/kristina-kotova-logo.svg"
            alt=""
            className={styles.logo}
            width={36}
            height={36}
          />
          <span className={styles.brandTexts}>
            <span className={styles.brandName}>Kristina Kotova</span>
            <span className={styles.brandSubtitle}>Lash & Brow Studio</span>
          </span>
        </Link>
        <AppHeaderNavigation />
        <Link href="/booking" className={styles.bookingLink}>
          Записаться
        </Link>
      </div>
    </header>
  );
};
