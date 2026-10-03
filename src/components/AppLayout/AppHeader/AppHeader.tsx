"use client";

import { usePathname } from "next/navigation";
import { Button, Layout, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";

import styles from "./AppHeader.module.css";

const navigationLinks = [
  { key: "/", href: "/", label: "Главная" },
  { key: "/services", href: "/services", label: "Услуги" },
  { key: "/works", href: "/works", label: "Работы" },
  { key: "/about", href: "/about", label: "О мастере" },
  { key: "/booking", href: "/booking", label: "Запись" },
  { key: "/#contacts", href: "/#contacts", label: "Контакты" },
];

export const AppHeader = () => {
  const pathname = usePathname();

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/kristina-kotova-logo.svg"
            alt=""
            className={styles.logo}
            width={32}
            height={32}
          />
          <div className={styles.brandTexts}>
            <Typography.Text className={styles.brandText}>
              Kristina Kotova
            </Typography.Text>
            <Typography.Text className={styles.brandSubtitle}>
              LASH & BROW STUDIO
            </Typography.Text>
          </div>
        </div>
        <nav className={styles.menu} aria-label="Основная навигация">
          {navigationLinks.map((item) => {
            const isActive = pathname === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={
                  isActive
                    ? `${styles.menuLink} ${styles.menuLinkActive}`
                    : styles.menuLink
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/booking">
            <Button className={styles.ctaButton}>Записаться</Button>
          </Link>
        </div>
      </div>
    </Layout.Header>
  );
};
