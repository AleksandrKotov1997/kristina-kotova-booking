import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { publicNavigationItems } from "../navigation";
import styles from "./AppFooter.module.css";

interface AppFooterProps {
  city?: string;
}

export const AppFooter = ({ city }: AppFooterProps) => (
  <footer className={styles.footer}>
    <PageContainer className={styles.inner}>
      <div className={styles.brand}>
        <StudioBrand variant="footer" />
      </div>
      <nav className={styles.navigation} aria-label="Навигация внизу страницы">
        {publicNavigationItems
          .filter((item) => item.href !== "/")
          .map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        <Link
          href="/admin"
          prefetch={false}
          className={`${styles.link} ${styles.masterLink}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
          Кабинет мастера
        </Link>
      </nav>
      <p className={styles.copyright}>
        © {new Date().getUTCFullYear()} Kristina Kotova
        {city ? " · " + city : ""}
      </p>
    </PageContainer>
  </footer>
);
