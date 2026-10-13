import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { Link, getPathname } from "@/shared/i18n/navigation";
import { useLocale } from "next-intl";
import { PageContainer } from "@/components/PageContainer";
import { StudioBrand } from "@/components/StudioBrand";
import { publicNavigationItems } from "../navigation";
import styles from "./AppFooter.module.css";

interface AppFooterProps {
  city?: string;
}

export const AppFooter = ({ city }: AppFooterProps) => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  return (
    <footer className={styles.footer}>
      <PageContainer className={styles.inner}>
        <div className={styles.brand}>
          <StudioBrand
            variant="footer"
            homeHref={getPathname({ locale, href: "/" })}
            homeLabel={t("brandHome")}
          />
        </div>
        <nav className={styles.navigation} aria-label={t("footerLabel")}>
          {publicNavigationItems
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {t(item.labelKey)}
              </Link>
            ))}
          <NextLink
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
            {t("master")}
          </NextLink>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getUTCFullYear()} Kristina Kotova
          {city ? " · " + city : ""}
        </p>
      </PageContainer>
    </footer>
  );
};
