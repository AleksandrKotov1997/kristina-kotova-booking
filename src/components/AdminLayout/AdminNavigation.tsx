"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminLayout.module.css";
export const AdminNavigation = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.navigation} aria-label="Кабинет мастера">
      {[
        { href: "/admin", label: "Обзор" },
        { href: "/admin/bookings", label: "Записи" },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={
            styles.link + (pathname === item.href ? " " + styles.active : "")
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
