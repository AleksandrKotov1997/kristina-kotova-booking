"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/currentUser/hooks/useCurrentUser";
import { ROLE_LABELS } from "@/features/currentUser/model/constants";
import { Avatar, Button, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import Image from "next/image";

import styles from "./AppHeader.module.css";

const navigationItems: MenuProps["items"] = [
  { key: "/", label: <Link href="/">Overview</Link> },
  { key: "/dashboard", label: <Link href="/dashboard">Dashboard</Link> },
  { key: "/requests", label: <Link href="/requests">Requests</Link> },
];

export const AppHeader = () => {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/bookflow-logo.svg"
            alt=""
            className={styles.logo}
            width={32}
            height={32}
          />
          <Typography.Text className={styles.brandText}>
            BookFlow Admin
          </Typography.Text>
        </div>
        <Menu
          mode="horizontal"
          items={navigationItems}
          className={styles.menu}
          selectedKeys={[pathname]}
        />
        <div className={styles.actions}>
          <Button className={styles.roleButton}>
            {currentUser ? ROLE_LABELS[currentUser.role] : "Manager"}
          </Button>
          <Avatar className={styles.avatar}>
            {currentUser ? currentUser.initials : "AK"}
          </Avatar>
        </div>
      </div>
    </Layout.Header>
  );
};
