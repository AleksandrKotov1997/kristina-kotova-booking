import Image from "next/image";
import Link from "next/link";
import styles from "./StudioBrand.module.css";

interface StudioBrandProps {
  variant?: "header" | "footer";
  homeHref?: string;
  homeLabel?: string;
}

export const StudioBrand = ({
  variant = "header",
  homeHref = "/",
  homeLabel = "Kristina Kotova — на главную",
}: StudioBrandProps) => (
  <Link
    href={homeHref}
    className={[styles.brand, variant === "footer" ? styles.footer : ""].join(
      " ",
    )}
    aria-label={homeLabel}
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
