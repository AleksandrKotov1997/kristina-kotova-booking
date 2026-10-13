"use client";
import { Link, usePathname } from "@/shared/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { publicNavigationItems } from "../navigation";
import styles from "./AppHeader.module.css";

export const AppHeaderNavigation = ({
  className,
  onNavigate,
  ariaLabel,
}: {
  className?: string;
  onNavigate?: () => void;
  ariaLabel?: string;
}) => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [areContactsVisible, setAreContactsVisible] = useState(false);
  useEffect(() => {
    if (pathname !== "/") return;
    const contacts = document.getElementById("contacts");
    if (!contacts) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAreContactsVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "-80px 0px 0px" },
    );
    observer.observe(contacts);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      className={[styles.navigation, className].filter(Boolean).join(" ")}
      aria-label={ariaLabel ?? t("mainLabel")}
    >
      {publicNavigationItems.map((item) => {
        const isActive =
          item.href === "/#contacts"
            ? pathname === "/" && areContactsVisible
            : (pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href + "/"))) &&
              !(pathname === "/" && areContactsVisible);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={styles.navigationLink}
            aria-current={isActive ? "page" : undefined}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
};
