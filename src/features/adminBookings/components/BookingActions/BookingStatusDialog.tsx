"use client";
import { Button, Modal } from "antd";
import {
  getAdminErrorMessage,
  isAdminAccessError,
} from "../../api/adminBookingsApi";
import type { useBookingStatusAction } from "../../hooks/useBookingStatusAction";
import { formatBookingDate } from "../../model/formatBookingDate";
import styles from "./BookingActions.module.css";

export const BookingStatusDialog = ({
  action,
}: {
  action: ReturnType<typeof useBookingStatusAction>;
}) => {
  const { selection, mutation } = action;
  if (!selection) return null;
  const { booking, status } = selection;
  return (
    <Modal
      styles={{
        container: {
          background: "var(--color-surface)",
          color: "var(--color-text)",
          borderRadius: "var(--radius-service-card)",
        },
        header: { background: "var(--color-surface)" },
        title: { color: "var(--color-text)" },
      }}
      open
      title={
        status === "cancelled"
          ? "Отменить запись?"
          : status === "completed"
            ? "Отметить выполненной?"
            : "Подтвердить запись?"
      }
      onCancel={action.close}
      closable={!mutation.isPending}
      mask={{ closable: !mutation.isPending }}
      keyboard={!mutation.isPending}
      footer={
        <div className={styles.footer}>
          <Button onClick={action.close} disabled={mutation.isPending}>
            Назад
          </Button>
          <Button
            className={styles.submit}
            loading={mutation.isPending}
            disabled={isAdminAccessError(mutation.error)}
            onClick={action.submit}
          >
            {status === "cancelled"
              ? "Отменить запись"
              : status === "completed"
                ? "Отметить выполненной"
                : "Подтвердить запись"}
          </Button>
        </div>
      }
    >
      <p className={styles.details}>
        <strong>{booking.clientName}</strong>
        <br />
        {booking.serviceName}
        <br />
        {formatBookingDate(booking.date)}, {booking.startTime}–{booking.endTime}
      </p>
      {status === "cancelled" && (
        <p>
          Время станет доступно для новой записи. Вернуть отменённую заявку
          нельзя.
        </p>
      )}
      {status === "completed" && (
        <p>
          Запись перейдёт в завершённые. Вернуть её в подтверждённые нельзя.
        </p>
      )}
      {mutation.isError && (
        <p className={styles.error} role="alert">
          {getAdminErrorMessage(mutation.error)}{" "}
          {isAdminAccessError(mutation.error) && (
            <a href="/admin/login">Войти снова</a>
          )}
        </p>
      )}
    </Modal>
  );
};
