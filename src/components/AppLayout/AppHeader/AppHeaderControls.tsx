"use client";

import { Button, Drawer } from "antd";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { ActionLink } from "@/components/ActionLink";
import { AppHeaderNavigation } from "./AppHeaderNavigation";
import styles from "./AppHeader.module.css";

export const AppHeaderControls = () => {
  const pathname = usePathname();
  return <HeaderMenu key={pathname} />;
};

const HeaderMenu = () => {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className={styles.controls}>
      <AppHeaderNavigation className={styles.desktopNavigation} />
      <ActionLink href="/booking" size="compact" className={styles.bookingLink}>
        Записаться
      </ActionLink>
      <Button
        className={styles.menuButton}
        icon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
        aria-label="Открыть меню"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(true)}
      />
      <Drawer
        title="Меню"
        open={open}
        onClose={closeMenu}
        size="min(100vw, 360px)"
        destroyOnHidden
        classNames={{ section: styles.drawer, body: styles.drawerBody }}
      >
        <div id={menuId} className={styles.mobileMenu}>
          <AppHeaderNavigation
            className={styles.mobileNavigation}
            ariaLabel="Мобильная навигация"
            onNavigate={closeMenu}
          />
          <ActionLink href="/booking" onClick={closeMenu}>
            Записаться онлайн
          </ActionLink>
        </div>
      </Drawer>
    </div>
  );
};
