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
      <StudioBrand variant="footer" />
      <nav className={styles.navigation} aria-label="Навигация внизу страницы">
        {publicNavigationItems
          .filter((item) => item.href !== "/")
          .map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
      </nav>
      <p className={styles.copyright}>
        © {new Date().getUTCFullYear()} Kristina Kotova
        {city ? " · " + city : ""}
      </p>
    </PageContainer>
  </footer>
);
