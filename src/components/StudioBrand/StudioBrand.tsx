import Image from "next/image";
import Link from "next/link";
import styles from "./StudioBrand.module.css";

interface StudioBrandProps {
  variant?: "header" | "footer";
}

export const StudioBrand = ({ variant = "header" }: StudioBrandProps) => (
  <Link
    href="/"
    className={[styles.brand, variant === "footer" ? styles.footer : ""].join(
      " ",
    )}
    aria-label="Kristina Kotova — на главную"
  >
    <Image
      src="/kristina-kotova-logo.svg"
      alt=""
      className={styles.logo}
      width={36}
      height={36}
    />
    <span className={styles.texts}>
      <span className={styles.name}>Kristina Kotova</span>
      <span className={styles.subtitle}>Lash & Brow Studio</span>
    </span>
  </Link>
);
