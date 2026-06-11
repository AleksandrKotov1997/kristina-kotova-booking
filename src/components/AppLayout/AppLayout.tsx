"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";
import { AppHeader } from "./AppHeader";
import styles from "./AppLayout.module.css";

interface Props {
  children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  return (
    <Layout className={styles.layout}>
      <AppHeader />
      <Layout.Content className={styles.content}>
        <main className={styles.main}>{children}</main>
      </Layout.Content>
    </Layout>
  );
};
