"use client";
import { Button, Skeleton } from "antd";
import {
  getAdminErrorMessage,
  isAdminAccessError,
} from "../../api/adminBookingsApi";
import styles from "./AdminQueryState.module.css";
export const AdminQueryState = ({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) => {
  if (!error)
    return (
      <div role="status" aria-label="Загрузка записей">
        <Skeleton active />
      </div>
    );
  return (
    <div className={styles.state} role="alert">
      <p>{getAdminErrorMessage(error)}</p>
      {isAdminAccessError(error) ? (
        <a href="/admin/login">Войти в кабинет</a>
      ) : (
        <Button onClick={onRetry}>Повторить</Button>
      )}
    </div>
  );
};
