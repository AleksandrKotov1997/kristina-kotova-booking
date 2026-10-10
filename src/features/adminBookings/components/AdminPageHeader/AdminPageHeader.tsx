"use client";
import { Button } from "antd";
import styles from "./AdminPageHeader.module.css";
export const AdminPageHeader = ({
  title,
  refreshing,
  onRefresh,
}: {
  title: string;
  refreshing: boolean;
  onRefresh: () => void;
}) => (
  <div className={styles.header}>
    <div>
      <h1>{title}</h1>
      <p>Астана · время студии · ежедневно 10:00–20:00</p>
    </div>
    <Button onClick={onRefresh} loading={refreshing}>
      Обновить
    </Button>
  </div>
);
