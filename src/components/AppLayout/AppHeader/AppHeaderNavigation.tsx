"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavigationItems } from "../navigation";
import styles from "./AppHeader.module.css";

export const AppHeaderNavigation = ({
  className,
  onNavigate,
  ariaLabel = "Основная навигация",
}: {
  className?: string;
  onNavigate?: () => void;
  ariaLabel?: string;
}) => {
  const pathname = usePathname();

  return (
    <nav
      className={[styles.navigation, className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {publicNavigationItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={styles.navigationLink}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
